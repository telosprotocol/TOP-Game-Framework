const { generateService } = require('@huhm/openapi-gen');

const apiDomain = 'http://localhost:8080';
const openapiList = [
  {
    requestLibPath: "import { requestVRaw as request } from '@/http/http';",
    schemaPath: apiDomain + '/v3/api-docs/client',
    mock: false,
    projectName: 'client',
  },
  {
    requestLibPath: "import { requestVRaw as request } from '@/http/http';",
    schemaPath: apiDomain + '/v3/api-docs/restful',
    mock: false,
    projectName: 'restful',
    namespace: 'RAPI',
  },
  {
    requestLibPath: "import { requestVRaw as request } from '@/http/http';",
    schemaPath: apiDomain + '/v3/api-docs/common',
    mock: false,
    projectName: 'common',
    namespace: 'CAPI',
  },
];

async function genOneProject({ schemaPath, projectName = 'api', ...rest }) {
  await generateService({
    serversPath: 'src/vservices',
    schemaPath: schemaPath,
    projectName: projectName,
    ...rest,
    hook: {
      customClassName(tagName) {
        // console.log('[Class]', tagName);
        return tagName;
      },
      customType(schemaObject, _namespace) {
        if (schemaObject.type === 'number' && !schemaObject.format) {
          if (schemaObject.isForQuery) {
            return 'BigDecimalStringAO';
          }
          return 'BigDecimalString';
        }
      },

      customFileNames(operationObject, apiPath) {
        const operationId = operationObject.operationId;
        if (!operationId) {
          console.warn('[Warning] no operationId', apiPath);
          return;
        }
        const res = operationId.split('_');
        if (res.length > 1) {
          res.shift();
          if (res.length > 2) {
            console.warn(
              '[Warning]  operationId has more than 2 part',
              apiPath
            );
          }
          return [res.join('_')];
        } else {
          const controllerName = (res || [])[0];
          if (controllerName) {
            return [controllerName];
          }
          return;
        }
      },
      afterOpenApiDataInited(openAPIData) {
        const schemasMap = openAPIData.components.schemas;
        const schemas = {
          ...schemasMap,
        };
        Object.keys(schemasMap).map((componentName) => {
          const componentSchema = schemas[componentName];
          const properties = componentSchema.properties;
          if (componentName.endsWith('AO')) {
            for (let fieldName in properties) {
              const property = properties[fieldName];
              property.isForQuery = true;
            }
          }
        });
        return {
          ...openAPIData,
          componets: {
            ...openAPIData.components,
            schemas,
          },
        };
      },
    },
  });
  console.log('Generate OK', projectName);
}

openapiList.forEach((item) => {
  console.log('Start generate', item.projectName);
  genOneProject(item);
});
