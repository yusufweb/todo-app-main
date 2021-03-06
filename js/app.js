$(document).ready(function(){
    // Global variables
    let insertList = document.querySelector("#todo-list");

    // theme changing functionality
    $("#theme-switcher").on("click", function(){
        // get alt value for image click 
        let imgAlt = $(this).attr("alt"); // = sun/moon
        switch (imgAlt) {
            case "sun":
                $("body").addClass("light-theme");
                $(this).attr("src", "images/icon-moon.svg");
                $(this).attr("alt","moon");
            break;
            case "moon":
                $("body").removeClass("light-theme");
                $(this).attr("src", "images/icon-sun.svg");
                $(this).attr("alt", "sun");
            break;
        }
    });

    /*
     *
     * totalTodo variable is initialized to 5 because of existing <li>'s tags - [todos] in index.html
     * Initialize totalTodo variable to 0 then clear all <li>'s tags - [todos] in index.html 
     *  
    */
    let totalTodo = 5; 
    $("#total-left").text(totalTodo);

    let allTodos = [];
    let todoObj;
    let id = 1;

    // add new item to list when enter key is press and released
    document.addEventListener("keyup", function(e){
        todoObj = {};
        if (e.keyCode === 13) {
            let todo = $("#add-new-todo").val();
            if(todo){
                todoObj.id = id;
                todoObj.name = todo;
                // todoObj.complete = false;
                // todoObj.delete = false;
                allTodos.push(todoObj);
                displayTodoDom(todoObj);
                console.log(allTodos);
                id++;
                totalTodo++;
                $("#total-left").text(totalTodo);
            }
            $("#add-new-todo").val("");
        }
    });

    // display new todo on the user interface
    let displayTodoDom = objValue => {    
        let items = `<li class="todo-list-item justify-content-between align-items-center active" id="${objValue.id}">
        <div class="circle">
            <i class="fa fa-circle-thin" id="unchecked" data-action="complete"></i>
        </div>
        <div class="todos">
          <p class="text">${objValue.name}</p>
        </div>
        <div id="delete-todo">
            <img src="images/icon-cross.svg" alt="delete to item" class="img-fluid" data-action="delete">
        </div>
      </li>`;
      let position = "beforeend";  
      insertList.insertAdjacentHTML(position, items);
    };

    /*
    * Track which element is clicked to:
    * complete or delete
    */ 
    insertList.addEventListener("click", function(ev){
        let element = ev.target;
        let eventTarget = $(element).data("action");
        if (eventTarget == "complete") {
            completeTodo(element);
        }
        if (eventTarget == "delete") {
            deleteTodo(element);
        }
        if (eventTarget == "unchecked") {
            uncheckTodo(element);
        }
    })

    // mark todo as completed
    let completeTodo = element => {
        let circle = element.parentNode.parentNode.querySelector(".circle");
        let linethrough = element.parentNode.parentNode.querySelector(".todos");
        linethrough.classList.add("line-through");
        element.parentNode.parentNode.classList.add("completed");
        element.parentNode.parentNode.classList.remove("active");
        circle.innerHTML = "<img src='images/icon-check.svg' alt='check' class='rounded-circle checked' data-action='unchecked'>";
        totalTodo--;
        $("#total-left").text(totalTodo);
    };

    // uncheck completed todos
    let uncheckTodo = element => {
        let circle = element.parentNode.parentNode.querySelector(".circle");
        let linethrough = element.parentNode.parentNode.querySelector(".todos");
        linethrough.classList.remove("line-through");
        element.parentNode.parentNode.classList.remove("completed");
        element.parentNode.parentNode.classList.add("active");
        circle.innerHTML = "<i class='fa fa-circle-thin' data-action='complete'></i>";
        totalTodo++;
        $("#total-left").text(totalTodo);
    };

    /*
     *
     * delete individual element
     * if element is marked as completed don't totalTodo--
     * if element is not marked as completed, do totalTodo--
    */
    let deleteTodo = element => {
        let linethrough = element.parentNode.parentNode;    
        if (!linethrough.classList.contains('completed')) {
            element.parentNode.parentNode.remove();
            totalTodo--;
            $("#total-left").text(totalTodo);
        }else {
            element.parentNode.parentNode.remove();
        }     
    };

    // clear or delete all completed(marked todo) todo
    $("#clear-complete-todo").on("click", function(){
        let completedTodos = document.querySelectorAll(".todo-list-item");
        completedTodos.forEach(element => {
            if (element.classList.contains('completed')) {
                element.remove();
            }
        });
    });

    // filter todo base on [all,active or completed]
    $(".nav-link").on("click", function(e){
        e.preventDefault();
        let data_filter = $(this).attr("data-filter"); 
        $(".todo-list-item").each(function(index, value) {
            if (data_filter == "all") {
                $(value).show('400');
            }
            else {
                $(value).not('.'+data_filter).hide('400');
                $(value).filter('.'+data_filter).show('400');
            }
        });
    });

    // change filter link color when clicked on [active-color] 
    $(".nav-link").on("click", function(){
        $(".nav-link").removeClass("active_tab");
        $(this).addClass("active_tab");
    });

    // reordering of todo list drag and drop
    const dragElement = document.querySelector("#todo-list");
    Sortable.create(dragElement, {
      animation: 200,
      ghostClass: "ghostBg"
    });
});