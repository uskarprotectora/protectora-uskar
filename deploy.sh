#!/bin/bash

echo "=== Despliegue Protectora Uskar ==="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI no esta instalado${NC}"
    echo "Instala con: brew install awscli"
    exit 1
fi

# Verificar Serverless
if ! command -v serverless &> /dev/null; then
    echo -e "${YELLOW}Instalando Serverless Framework...${NC}"
    npm install -g serverless
fi

# Variables
REGION="eu-west-1"
FRONTEND_BUCKET="protectora-uskar-frontend"
STAGE="prod"

echo -e "${YELLOW}Paso 1: Configurar credenciales AWS${NC}"
echo "Asegurate de tener configurado: aws configure"
echo ""

# Verificar MONGODB_URI
if [ -z "$MONGODB_URI" ]; then
    echo -e "${RED}Error: Variable MONGODB_URI no configurada${NC}"
    echo "Ejecuta: export MONGODB_URI='tu-connection-string-de-mongodb-atlas'"
    exit 1
fi

echo -e "${GREEN}MONGODB_URI configurada${NC}"
echo ""

echo -e "${YELLOW}Paso 2: Desplegando Backend (Lambda + API Gateway)...${NC}"
cd backend
npm install
serverless deploy --stage $STAGE --region $REGION

# Obtener URL de API Gateway
API_URL=$(serverless info --stage $STAGE --region $REGION | grep "endpoint:" | awk '{print $2}')
echo ""
echo -e "${GREEN}API desplegada en: $API_URL${NC}"

echo ""
echo -e "${YELLOW}Paso 3: Actualizando configuracion del frontend...${NC}"
cd ../frontend

# Actualizar config.js con la URL de la API
cat > js/config.js << EOF
// Configuracion de la API - Produccion
const CONFIG = {
    API_BASE_URL: '${API_URL}'
};

window.API_BASE_URL = CONFIG.API_BASE_URL;
EOF

echo -e "${GREEN}Frontend configurado con API URL${NC}"

echo ""
echo -e "${YELLOW}Paso 4: Creando bucket S3 para frontend...${NC}"
aws s3 mb s3://$FRONTEND_BUCKET --region $REGION 2>/dev/null || true

# Configurar bucket para hosting estatico
aws s3 website s3://$FRONTEND_BUCKET --index-document index.html --error-document index.html

# Configurar politica publica
cat > /tmp/bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${FRONTEND_BUCKET}/*"
        }
    ]
}
EOF

aws s3api put-public-access-block \
    --bucket $FRONTEND_BUCKET \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false" \
    --region $REGION

aws s3api put-bucket-policy --bucket $FRONTEND_BUCKET --policy file:///tmp/bucket-policy.json --region $REGION

echo ""
echo -e "${YELLOW}Paso 5: Subiendo frontend a S3...${NC}"
aws s3 sync . s3://$FRONTEND_BUCKET --exclude "*.DS_Store" --region $REGION

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}    DESPLIEGUE COMPLETADO${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Frontend: ${GREEN}http://${FRONTEND_BUCKET}.s3-website-${REGION}.amazonaws.com${NC}"
echo -e "API:      ${GREEN}${API_URL}${NC}"
echo ""
echo -e "${YELLOW}Para usar CloudFront (HTTPS + CDN), ejecuta:${NC}"
echo "aws cloudfront create-distribution --origin-domain-name ${FRONTEND_BUCKET}.s3.${REGION}.amazonaws.com"
