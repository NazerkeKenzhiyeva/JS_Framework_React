
# JavaScript Async Task Runner

This project is for practicing JavaScript async topics.

I used HTML, CSS and vanilla JavaScript.

The project has 3 tasks:
- Load Users
- Load Posts
- Load Comments

Each task has status, run count and loading time.

## Closure

I used `createTask()` with a private `count` variable.

Each task has its own counter.

## Promises

Each task returns a Promise.

I used `setTimeout()` to simulate loading from 500 to 2000 ms.

Some tasks can fail randomly.

For success I use `resolve()`, and for errors I use `reject()`.

## Run All

`Run All Tasks` starts all tasks together.

I used `Promise.allSettled()` because I want to wait for all tasks even if one fails.

## Sequential and Concurrent

Sequential means tasks run one after another.

Concurrent means tasks run at the same time.

Concurrent is usually faster because we wait mostly for the longest task.

## Event Loop

My output was:

```text
Start
Async start
End
Promise 1
Async after await
Promise 2
Timer 1
Timer 2
````

Normal code runs first.

Then microtasks like Promise and `await`.

After that tasks like `setTimeout()` run.

Order:

```text
Call Stack
→ Microtask Queue
→ Task Queue
```

## Tasks and Microtasks

Promises and `await` use microtasks.

`setTimeout()` uses tasks.

Microtasks run before tasks.

