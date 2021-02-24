// jQuery Script

// Handler for document ready 
$(document).ready(function(){
    // handler to add task
    $("#add-task-form").submit(function(event){
        addTask(event);
    });

    // handler to edit task
    $("#edit-task-form").submit(function(event){
        editTask(event);
    });

    // handler to remove task
    $("#task-table").on("click", "#removeTask", function(){
        id = $(this).data("id");
        removeTask(id);
    });

     // handler to clear tasks
     $("#clear-tasks").on("click", function(){
        clearTasks();
    });

    // function to add a task
    function addTask(event){
        //Generates a unique task id with the time stamp of the submited form
        let id=new Date().getTime();

        //Gets information for each form field
        let tTask = $("#TaskItem").val();
        let tDate = $("#TaskDate").val();
        let tTime = $("#TaskTime").val();
        let tPriority = $("#TaskPriority").val();

        console.log(tTask,tDate,tTime,tPriority);
        //validate information
        if (tTask == '') {
            alert('Please introduce a valid task description');
            event.preventDefault();
        } else if (tDate == '') {
            alert('A valid date is required');
            event.preventDefault();
        } else if (tTime == '') {
            alert('A valid time is required');
            event.preventDefault();
        } else if (tPriority == '') {
            tPriority = 'Normal'
        };

        // if validation is passed
        let tasksList=JSON.parse(localStorage.getItem("Tasks"));
        if (tasksList == null) {
            tasksList = []
        }

        let newTask = {
            "id" : id,
            "task" : tTask,
            "date" : tDate,
            "time" : tTime,
            "priority" : tPriority    
        }

        tasksList.push(newTask);

        // Sort list by time
        tasksList = tasksList.sort(sortByDateAndTime);

        localStorage.setItem("Tasks",JSON.stringify(tasksList));
    };

    // function to edit a task
    function editTask(event){

        //Gets information for each form field
        let tTask = $("#TaskItem").val();
        let tDate = $("#TaskDate").val();
        let tTime = $("#TaskTime").val();
        let tPriority = $("#TaskPriority").val();
        let id = $("#taskID").val();

        console.log(tTask,tDate,tTime,tPriority);
        //validate information
        if (tTask == '') {
            alert('Please introduce a valid task description');
            event.preventDefault();
        } else if (tDate == '') {
            alert('A valid date is required');
            event.preventDefault();
        } else if (tTime == '') {
            alert('A valid time is required');
            event.preventDefault();
        } else if (tPriority == '') {
            tPriority = 'Normal'
        };

        // if validation is passed
        let tasksList=JSON.parse(localStorage.getItem("Tasks"));
        if (tasksList == null) {
            tasksList = []
        }

        for (let task of tasksList) {
            if (task.id == id) {
                task.task = tTask;
                task.date = tDate;
                task.time = tTime;
                task.priority = tPriority;
            }
        }
    
        // Sort list by time
        tasksList = tasksList.sort(sortByDateAndTime);

        localStorage.setItem("Tasks",JSON.stringify(tasksList));
    };

    // helper function to sort tasks list
    function sortByDateAndTime(a,b) {
        let aTime = a.time; aDate = a.date;
        let bTime = b.time; bDate = b.date;
        return ((aDate>bDate)? 1: (bDate>aDate)? -1: 
                (aTime>bTime)? 1: (bTime>aTime)? -1: 0);
    };

    displayTasks();

    //function to display tasks in task-table
    function displayTasks() {
        let tasksList = JSON.parse(localStorage.getItem("Tasks"));

        if (tasksList != null) {
            $.each(tasksList, function(key, value){
                $("#task-table").append(
                    "<tr id=" + value.id + ">"+
                    "<td>" + value.task + "</td>"+
                    "<td>" + value.priority + "</td>"+
                    "<td>" + value.date + "</td>"+
                    "<td>" + value.time + "</td>"+
                    "<td><a href=\"editTask.html?id=" + value.id + "\">Edit</a>"+
                    " | <a id=\"removeTask\" data-id=\"" + value.id + "\" href=\"#\">Remove</a></td>"+
                    "</tr>"
                );
            });
        };
    };

    //function to remove task by id
    function removeTask(id) {
        if (confirm("Are you sure you want to delete this task?")){
            tasksList = JSON.parse(localStorage.getItem("Tasks"));

            for (let i = 0; i<tasksList.length; i++) {
                if (tasksList[i].id == id) {
                    tasksList.splice(i,1);
                }
            };

            localStorage.setItem("Tasks",JSON.stringify(tasksList));
        }
        location.reload();
    };

    //function to clear all tasks
    function clearTasks() {
        if (confirm("Are you sure you want to delete all task?")){
            localStorage.removeItem("Tasks");
        }
        location.reload();
    };
});

// Get task by ID for the editTask page
function getTask() {
    const $_GET = getQuerryParams(document.location.search);
    id = $_GET["id"];

    let tasksList = JSON.parse(localStorage.getItem("Tasks"));

    for (let task of tasksList) {
        if (task.id == id) {
            $("#edit-task-form #taskID").val(id);
            $("#edit-task-form #TaskItem").val(task.task);
            $("#edit-task-form #TaskDate").val(task.date);
            $("#edit-task-form #TaskTime").val(task.time);
            $("#edit-task-form #TaskPriority").val(task.priority);
        }
    }
};

function getQuerryParams(qs){
    qs = qs.split("+").join(" ");
    let params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            =decodeURIComponent(tokens[2]);
    };
    return params;
};