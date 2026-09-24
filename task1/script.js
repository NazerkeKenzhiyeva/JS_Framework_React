function createTask(name){
    let count=0;

    return{
        run: function () {
            count++;

            const loadingTime = Math.floor(Math.random() * 1501) + 500;

            return new Promise(function (resolve, reject) {

                setTimeout(function () {

                    const success = Math.random() > 0.3;

                    if (success) {
                        resolve({
                            status: "Completed",
                            time: loadingTime
                        });
                    } else {
                        reject({
                            status: "Failed",
                            time: loadingTime
                        });
                    }

                }, loadingTime);

            });
        },
        
        
        getCount: function(){
            return count;

        },

        reset: function(){
            count = 0;
        }


    };
}

const usersTask = createTask("Load Users");
const postsTask = createTask("Load Posts");
const commentsTask = createTask("Load Comments");

document.getElementById("users-btn").addEventListener("click", function () {

    const button = document.getElementById("users-btn");

    button.disabled = true;

    document.getElementById("users-status").textContent = "Loading";

    usersTask.run()
        .then(function (result) {

            document.getElementById("users-status").textContent =
                result.status;

            document.getElementById("users-time").textContent =
                result.time;
        })
        .catch(function (error) {

            document.getElementById("users-status").textContent =
                error.status;

            document.getElementById("users-time").textContent =
                error.time;
        })

        .finally(function () {
            button.disabled = false;
        });



    document.getElementById("users-count").textContent =
        usersTask.getCount();
});

document.getElementById("posts-btn").addEventListener("click", function () {

    const button = document.getElementById("posts-btn");

    button.disabled = true;



    document.getElementById("posts-status").textContent = "Loading";

    postsTask.run()
        .then(function (result) {

            document.getElementById("posts-status").textContent =
                result.status;

            document.getElementById("posts-time").textContent =
                result.time;
        })
        .catch(function (error) {

            document.getElementById("posts-status").textContent =
                error.status;

            document.getElementById("posts-time").textContent =
                error.time;
        })

        .finally(function () {
            button.disabled = false;
        });

    document.getElementById("posts-count").textContent =
        postsTask.getCount();
});

document.getElementById("comments-btn").addEventListener("click", function () {
    const button = document.getElementById("comments-btn");
    button.disabled = true;

    document.getElementById("comments-status").textContent = "Loading";

    commentsTask.run()
        .then(function (result) {

            document.getElementById("comments-status").textContent =
                result.status;

            document.getElementById("comments-time").textContent =
                result.time;
        })
        .catch(function (error) {

            document.getElementById("comments-status").textContent =
                error.status;

            document.getElementById("comments-time").textContent =
                error.time;
        })

        .finally(function () {
            button.disabled = false;
        });



    document.getElementById("comments-count").textContent =
        commentsTask.getCount();
});

document.getElementById("users-reset").addEventListener("click", function () {
    usersTask.reset();

    document.getElementById("users-count").textContent = 0;
    document.getElementById("users-status").textContent = "Ready";
    document.getElementById("users-time").textContent = 0;
});

document.getElementById("posts-reset").addEventListener("click", function () {
    postsTask.reset();

    document.getElementById("posts-count").textContent = 0;
    document.getElementById("posts-status").textContent = "Ready";
    document.getElementById("posts-time").textContent = 0;
});

document.getElementById("comments-reset").addEventListener("click", function () {
    commentsTask.reset();

    document.getElementById("comments-count").textContent = 0;
    document.getElementById("comments-status").textContent = "Ready";
    document.getElementById("comments-time").textContent = 0;
});

document.getElementById("run-all-btn").addEventListener("click", function () {

    document.getElementById("all-status").textContent = "Running all tasks...";

    document.getElementById("users-status").textContent = "Loading";
    document.getElementById("posts-status").textContent = "Loading";
    document.getElementById("comments-status").textContent = "Loading";

    const usersPromise = usersTask.run();
    const postsPromise = postsTask.run();
    const commentsPromise = commentsTask.run();

    document.getElementById("users-count").textContent =
        usersTask.getCount();

    document.getElementById("posts-count").textContent =
        postsTask.getCount();

    document.getElementById("comments-count").textContent =
        commentsTask.getCount();

    Promise.allSettled([
        usersPromise,
        postsPromise,
        commentsPromise
    ]).then(function (results) {

        updateTaskResult(results[0], "users");
        updateTaskResult(results[1], "posts");
        updateTaskResult(results[2], "comments");

        document.getElementById("all-status").textContent =
            "All tasks finished";
    });
});

function updateTaskResult(result, taskName) {

    if (result.status === "fulfilled") {

        document.getElementById(taskName + "-status").textContent =
            result.value.status;

        document.getElementById(taskName + "-time").textContent =
            result.value.time;

    } else {

        document.getElementById(taskName + "-status").textContent =
            result.reason.status;

        document.getElementById(taskName + "-time").textContent =
            result.reason.time;
    }
}

async function runTask(task, taskName) {

    document.getElementById(taskName + "-status").textContent = "Loading";

    try {
        const result = await task.run();

        document.getElementById(taskName + "-status").textContent =
            result.status;

        document.getElementById(taskName + "-time").textContent =
            result.time;

    } catch (error) {

        document.getElementById(taskName + "-status").textContent =
            error.status;

        document.getElementById(taskName + "-time").textContent =
            error.time;
    }

    document.getElementById(taskName + "-count").textContent =
        task.getCount();
}

document.getElementById("sequential-btn").addEventListener("click", async function () {

    const startTime = performance.now();

    await runTask(usersTask, "users");
    await runTask(postsTask, "posts");
    await runTask(commentsTask, "comments");

    const endTime = performance.now();

    const totalTime = Math.round(endTime - startTime);

    document.getElementById("sequential-time").textContent =
        totalTime;
});

document.getElementById("concurrent-btn").addEventListener("click", async function () {

    const startTime = performance.now();

    await Promise.all([
        runTask(usersTask, "users"),
        runTask(postsTask, "posts"),
        runTask(commentsTask, "comments")
    ]);

    const endTime = performance.now();

    const totalTime = Math.round(endTime - startTime);

    document.getElementById("concurrent-time").textContent =
        totalTime;
});

document.getElementById("event-loop-btn").addEventListener("click", function () {

    const output = document.getElementById("event-output");

    output.textContent = "";

    function log(message) {
        console.log(message);
        output.textContent += message + "\n";
    }

    async function asyncExample() {
        log("Async start");

        await Promise.resolve();

        log("Async after await");
    }

    log("Start");

    setTimeout(function () {
        log("Timer 1");
    }, 0);

    Promise.resolve().then(function () {
        log("Promise 1");
    });

    asyncExample();

    Promise.resolve().then(function () {
        log("Promise 2");
    });

    setTimeout(function () {
        log("Timer 2");
    }, 0);

    log("End");
});