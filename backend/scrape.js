const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const knowledge = [];

  async function extractContent(url, entries) {
    console.log(`🔍 Visitando ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('body');

    const result = await page.evaluate((entries) => {
      const data = [];

      function getTextByHeadingMatch(headingKeyword) {
        const elements = document.querySelectorAll('*');
        for (let el of elements) {
          const txt = el.innerText?.toLowerCase().trim();
          if (txt && txt.includes(headingKeyword.toLowerCase()) && txt.length < 150) {
            const parent = el.closest('.elementor-widget-container') || el.parentElement;
            if (parent) {
              const fullText = parent.innerText?.trim();
              if (fullText && fullText.length > 50) {
                return fullText;
              }
            }
          }
        }
        return null;
      }

      entries.forEach(({ id, pregunta, tags, heading }) => {
        const texto = getTextByHeadingMatch(heading);
        if (texto) {
          data.push({ id, pregunta, tags, respuesta: texto });
        }
      });

      return data;
    }, entries);

    return result;
  }

  async function extractBodyText(url, questionConfig) {
    console.log(`Extrayendo todo el texto de: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('body');

    const text = await page.evaluate(() => {
      return document.body.innerText.trim();
    });

    if (text && text.length > 100) {
      return [{
        id: questionConfig.id,
        pregunta: questionConfig.pregunta,
        tags: questionConfig.tags,
        respuesta: text.slice(0, 3000) // límite razonable
      }];
    }
    return [];
  }

  // Configuración de páginas y preguntas
  const pages = [
    {
      url: 'https://fundacionconcristo.org.ec/home/',
      method: extractBodyText,
      questions: [{
        id: 'inicio-001',
        pregunta: '¿Qué dice la página de inicio?',
        tags: ['inicio', 'bienvenida', 'presentación']
      }]
    },
    {
      url: 'https://fundacionconcristo.org.ec/home/quienes-somos/',
      method: extractContent,
      questions: [
        {
          id: 'mision-001',
          pregunta: '¿Cuál es la misión de la fundación?',
          tags: ['misión', 'objetivo'],
          heading: 'misión'
        },
        {
          id: 'vision-001',
          pregunta: '¿Cuál es la visión de la fundación?',
          tags: ['visión', 'meta'],
          heading: 'visión'
        },
        {
          id: 'historia-001',
          pregunta: '¿Cuál es la historia de la fundación?',
          tags: ['historia', 'origen', 'fundación'],
          heading: 'historia'
        }
      ]
    },
    {
      url: 'https://fundacionconcristo.org.ec/home/centro-infantil/',
      method: extractBodyText,
      questions: [{
        id: 'proyecto-centro-infantil-001',
        pregunta: '¿Qué es el Centro Infantil de la fundación?',
        tags: ['centro infantil', 'proyecto', 'niños']
      }]
    },
    {
      url: 'https://fundacionconcristo.org.ec/home/consultorio-medico/',
      method: extractBodyText,
      questions: [{
        id: 'proyecto-consultorio-medico-001',
        pregunta: '¿Qué ofrece el consultorio médico?',
        tags: ['consultorio', 'salud', 'médico']
      }]
    },
    {
      url: 'https://fundacionconcristo.org.ec/home/colaboradores/',
      method: extractBodyText,
      questions: [{
        id: 'colaboradores-001',
        pregunta: '¿Quiénes son los colaboradores de la fundación?',
        tags: ['colaboradores', 'equipo', 'apoyo']
      }]
    },
    {
      url: 'https://fundacionconcristo.org.ec/home/benefactores/',
      method: extractBodyText,
      questions: [{
        id: 'benefactores-001',
        pregunta: '¿Quiénes son los benefactores de la fundación?',
        tags: ['benefactores', 'donantes', 'apoyo']
      }]
    },
    {
      url: 'https://fundacionconcristo.org.ec/home/noticias-recientes/',
      method: extractBodyText,
      questions: [{
        id: 'noticias-001',
        pregunta: '¿Qué noticias recientes ha publicado la fundación?',
        tags: ['noticias', 'eventos', 'actualidad']
      }]
    },
    {
      url: 'https://fundacionconcristo.org.ec/home/contact/',
      method: extractBodyText,
      questions: [{
        id: 'contacto-001',
        pregunta: '¿Cómo puedo contactar con la fundación?',
        tags: ['contacto', 'teléfono', 'correo', 'ubicación']
      }]
    },
    {
      url: 'https://fundacionconcristo.org.ec/home/donaciones-4/',
      method: extractBodyText,
      questions: [{
        id: 'donaciones-001',
        pregunta: '¿Cómo puedo donar a la fundación?',
        tags: ['donaciones', 'ayuda', 'apoyo económico']
      }]
    }
  ];

  // Ejecutar todas las extracciones
  for (const pageConfig of pages) {
    const results = await pageConfig.method(pageConfig.url, pageConfig.questions);
    knowledge.push(...results);
  }

  await browser.close();

  // Guardar resultado
  fs.writeFileSync('../data/auto_knowledge.json', JSON.stringify(knowledge, null, 2));
  console.log(`Extraído y guardado: ${knowledge.length} entradas en auto_knowledge.json`);
})();
