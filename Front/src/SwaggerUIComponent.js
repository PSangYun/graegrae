import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUIComponent = () => {
  const swaggerUrl = './openapi3_0.json'; // Swagger JSON 파일의 URL

  return (
    <div style={{ height: '100vh' ,overflowY:'auto' }}>
      <SwaggerUI url={swaggerUrl} />
    </div>
  );
};

export default SwaggerUIComponent;