import puppeteer from "puppeteer";

const getTasks = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Abrir una nueva pagina
  const page = await browser.newPage();

  // En esta nueva pagina se abre el sitio web y se espera a que este listo el contenido.
  await page.goto("https://trello.com/b/QvHVksDa/personal-work-goals", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector(".list-card-title");

  // Obtiene las tareas de trello
  const tasks = await page.evaluate(() => {
    const taskElements = document.querySelectorAll(".list-card-title");
    const taskList = [];

    for (const taskElement of taskElements) {
      taskList.push(taskElement.textContent);
    }

    return taskList;
  });

  // Muestra las tareas

  console.log(tasks);
  // Cierra el navegador
  await browser.close();
  return tasks;
};

const insertTask = async (datos) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Se abre una nueva pagina
  const page = await browser.newPage();

  // En esta nueva pagina se abre el sitio web y se espera a que este listo el contenido.

  await page.goto("https://todoist.com/app/today", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector("button[id='quick_add_task_holder']");
  const boton = await page.$("button[id='quick_add_task_holder']");
  await boton.click();
  await page.waitForSelector(".is-empty is-editor-empty");

  const tarea = await page.$("p[class='is-empty is-editor-empty']");
  tarea.type(datos);

  const agregar = await page.$("button[type='submit']");
  await agregar.click();

  // Se cierra el navegador
  await browser.close();
};
// Start the scraping

const datos = await getTasks();
insertTask(datos[0]);
