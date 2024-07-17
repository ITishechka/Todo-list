(function () {
  let objectsList = [];
    listName = '';
  function createAppTitle(title) {
    let appTitle = document.createElement('h2'); // Создаем элемент-тег h2
    appTitle.innerHTML = title; // Передаем текст в тег h2
    return appTitle; // Возвращаем DOM элемент
  }

  //Создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form'); // Создаем тег form
    let input = document.createElement('input') // Создаем тег input
    let buttonWrapper = document.createElement('div'); // Создаем элемент div для стилей кнопки через bootstrap
    let button = document.createElement('button'); // Создаем тег button-кнопка

    form.classList.add('input-group', 'md-3'); // К форме добавляем классы, для стилизации формы(Bootstrap)
    input.classList.add('form-control'); // К полю для ввода добавляем классы, для стилизации формы(Bootstrap)
    input.placeholder = 'Введите название нового дела'; // Добавляем пояснение в поле для ввода через атрибут placeholder
    buttonWrapper.classList.add('input-group-append'); // Добовляем к тегу div класс для позиционировани(справа) какого-либо элемента в форме(Bootstrap)
    button.classList.add('btn', 'btn-primary'); // Добавляем к кнопке стилизацию(Bootstrap)
    button.textContent = 'Добавить дело'; // Добавляем текст в кнопку
    button.disabled = true;

    // Объеденяем DOM элементы в единную структуру
    buttonWrapper.append(button); // В buttonWrapper вкладываем button-кнопка
    form.append(input); // В форму вкладываем input-поле для ввода
    form.append(buttonWrapper); // В форму вкладываем div.buttonWrapper

    input.addEventListener('input', () => {
      if (input.value !== '') {
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    })

    // Возвращаем результат
    return {
      form,
      input,
      button,
    };
  }

  // Функцая создает список
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(obj) {
    let item = document.createElement('li');
    // Cоздаем и помещаем кнопки в элемент списка, который красиво покажет их в одной группе/строке
    let buttonGroup = document.createElement('div'); // Создаем div в котором будет размещаться элемент элеменнт списка и 2 кнопки
    let doneButton = document.createElement('button'); // Создаем кнопку, которая отмечает дело как сделанное
    let deleteButton = document.createElement('button'); // Создаем кнопку, которая удаляет дело

    // Добовляем стили для элемента списка, а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name; // name задается как аргумент функции createTodoItem

    // Добавляем классы к кнопкам для стилизации
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success') // 'btn-success' делает кнопку зеленой
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger'); // 'btn-danger' делает кнопку красной
    deleteButton.textContent = 'Удалить';

    if (obj.done ==true) {
      item.classList.add('list-group-item-success');
    }

    // Добавляем обработчики на кнопки
    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');
      for (let listItem of objectsList) {
        if (listItem.id == obj.id) {
          listItem.done = !listItem.done;
        }
      }
      saveList(objectsList, listName);
    });

    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) { // confirm - Функция в браузере уведомление вернет true или false
        item.remove();
        for (let i = 0; i < objectsList.length; ++i) {
          if (objectsList[i].id == obj.id) {
            objectsList.splice(i, 1);
          }
          item.remove;
        }
      }
      saveList(objectsList, listName);
    })

    // Вкладываем кнопки в группу кнопок, затем группу кнопок вкладываем в элемент списка
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // Приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function getNewId(arr) {
    let max = 0;
    for(let item of arr) {
      if(item.id > max) max = item.id;
        max = item.id;
    }
    return max + 1;
  }

  function saveList(arr, localKey) {
     localStorage.setItem(localKey,JSON.stringify(arr));
  }

  function createTodoApp(container, title = 'Список дел', localKey) {
    // Вызываем по очереди все 3 функции
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    listName = localKey;

    // Результат функций размещаем внутри container
    container.append(todoAppTitle);
    container.append(todoItemForm.form); // todoItemForm - это объект, поэтому снача выводим form
    container.append(todoList);

    let localData = localStorage.getItem(listName)

    if(localData !== null && localData !== '') {
      objectsList = JSON.parse(localData);
    }

    for(let itemList of objectsList) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }

    // Браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function (e) { // submit специальный обработчик для формы, работает при нажатии на Enter и кнопку внутри формы
      e.preventDefault(); // Эта строчка необходима, чтобы предотвратить стандартное действие браузера, в данном случаее мы не хотим чтобы страница перезагружалась при отправки формы
      if (!todoItemForm.input.value) { // Проверяем есть ли какое-нубидь значение в input.
        return; // Игнорируем создание элемента, если пользователь ничего не ввел
      }

      let newItem = {
        id: getNewId(objectsList),
        name: todoItemForm.input.value,
        done: false
      }

      let todoItem = createTodoItem(newItem); // Помещаем в todoItem результат выполнения функции createTodoItem

      objectsList.push(newItem);
      console.log(objectsList);

      saveList(objectsList, listName);

      // Создаем и добавляем в список новое дело с названием из поле ввода
      todoList.append(todoItem.item);
      // Обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.button.disabled = true;
      todoItemForm.input.value = '';
    });
  }

  window.createTodoApp = createTodoApp;
})();
