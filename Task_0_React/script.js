const pages = [];

function addPage(title, note, answers) {
  pages.push({ title, note, answers });
}

// task1.
const name = "Nazerke";
let age = 20;
const active = true;
const courses = ["Preparation for IELTS", "IT Audit"];
const address = { city: "Almaty", street: "Kurmangazy" };
const noMiddleName = null;
let futureCourse;

addPage("Variables and Data Types", "I learned that every value has a type.", [
  ["Student name", `${name} - ${typeof name}`],
  ["Age", `${age} - ${typeof age}`],
  ["Active", `${active} - ${typeof active}`],
  ["Courses", `${courses.join(", ")} - ${typeof courses}`],
  ["Address", `${address.city}, ${address.street} - ${typeof address}`],
  ["Phone number", `${noMiddleName} - ${typeof noMiddleName}`],
  ["Future course", `${futureCourse} - ${typeof futureCourse}`],
  ["Sentence", `${name} is ${age} years old and lives in ${address.city}.`]
]);

// task2
const sourceNumbers = [3, 7, 2, 10, 5];
const arrayWork = {
  doubled: sourceNumbers.map(item => item * 2),
  overFive: sourceNumbers.filter(item => item > 5),
  firstOverFive: sourceNumbers.find(item => item > 5),
  sum: sourceNumbers.reduce((current, item) => current + item, 0),
  hasTen: sourceNumbers.includes(10)
};

addPage("Arrays", "Array methods make the work short and clear.", [
  ["Original", sourceNumbers],
  ["Multiplied by 2", arrayWork.doubled],
  ["Numbers over 5", arrayWork.overFive],
  ["First number over 5", arrayWork.firstOverFive],
  ["Sum", arrayWork.sum],
  ["Does 10 exist?", arrayWork.hasTen]
]);

// task3
const gradeBook = [
  { id: 1, name: "Anna", grade: 85 },
  { id: 2, name: "John", grade: 62 },
  { id: 3, name: "Sara", grade: 91 },
  { id: 4, name: "Mike", grade: 55 }
];
const selectedStudents = gradeBook.filter(person => person.grade >= 70);
const allNames = gradeBook.map(person => person.name);
const selectedById = gradeBook.find(person => person.id === 3);
const bestGrade = Math.max(...gradeBook.map(person => person.grade));
const bestStudent = gradeBook.find(person => person.grade === bestGrade);
const classAverage = gradeBook.reduce((total, person) => total + person.grade, 0) / gradeBook.length;
const gradeStatus = gradeBook.map(person => ({ ...person, passed: person.grade >= 60 }));

addPage("Arrays of Objects", "I made new arrays, so the first objects are not changed.", [
  ["Grade 70 or higher", selectedStudents],
  ["Names", allNames],
  ["Student with ID 3", selectedById],
  ["Highest grade", bestStudent],
  ["Average grade", classAverage],
  ["Passed field", gradeStatus]
]);

// task4
const profile = {
  id: 7,
  name: "Amina",
  age: 19,
  address: { city: "Astana", street: "Saryarka" }
};
const firstRead = `${profile.name}, ${profile.address.city}`;
profile.age = 20;
profile.email = "amina@mail.com";
delete profile.address.street;
const { name: userName, age: profileAge } = profile;
const { address: { city: profileCity } } = profile;

addPage("Objects", "An object keeps related information in one place.", [
  ["Name and city", firstRead],
  ["Changed profile", profile],
  ["Destructured values", `${userName}, ${profileAge}, ${profileCity}`]
]);

// task5
const original = { name: "Alice", score: 10 };
const linkedCopy = original;
linkedCopy.score = 25;
const scoreAfterLink = original.score;
const spreadCopy = { ...original };
spreadCopy.score = 40;

const firstUser = { name: "Alice", address: { city: "Almaty" } };
const shallowUser = { ...firstUser };
shallowUser.address.city = "Taraz";
const cityAfterShallowCopy = firstUser.address.city;
const deepEnoughUser = { ...firstUser, address: { ...firstUser.address } };
deepEnoughUser.address.city = "Aktau";

addPage("Values and References", "Objects can share the same place in memory.", [
  ["Shared score", scoreAfterLink],
  ["Reason", "linkedCopy and original point to one object."],
  ["Spread score", `Original ${original.score}, new copy ${spreadCopy.score}`],
  ["Shallow city", cityAfterShallowCopy],
  ["Why city changed", "The nested address was still the same object."],
  ["Nested copy", `Original ${firstUser.address.city}, new copy ${deepEnoughUser.address.city}`]
]);

//task6
function isEven(number) {
  return number % 2 === 0;
}

function getFullName(firstName, lastName) {
  return firstName + " " + lastName;
}

function calculatePrice(price, quantity) {
  return price * quantity;
}

const calculateDiscount = (price, percent) => price * (1 - percent / 100);
const getMax = (a, b) => Math.max(a, b);
const getFullNameArrow = (firstName, lastName) => `${firstName} ${lastName}`;

addPage("Functions", "A function can be used many times with different values.", [
  ["isEven(11)", isEven(11)],
  ["Full name", getFullName("Nazlu", "Student")],
  ["Arrow full name", getFullNameArrow("Sara", "Kim")],
  ["Price", calculatePrice(750, 4)],
  ["Discount", calculateDiscount(5000, 15)],
  ["Maximum", getMax(22, 17)]
]);

// task7
function add(a, b) {
  return a + b;
}
const multiply = (a, b) => a * b;
const calculate = (a, b, operation) => operation(a, b);

addPage("Functions as Values", "JavaScript lets us pass a function to another function.", [
  ["Add result", calculate(5, 3, add)],
  ["Multiply result", calculate(5, 3, multiply)],
  ["Store and pass", "Yes, a function can be in a variable and can be an argument."],
  ["add and add()", "add means the function itself. add() runs it."]
]);

// task8
const scopeOutput = [];
const message = "global";
scopeOutput.push(message);

function readScopes() {
  const message = "function";
  scopeOutput.push(message);
  if (true) {
    const message = "block";
    var visibleVar = "var can leave an if block";
    let hiddenLet = "let is only in this block";
    const hiddenConst = "const is also only in this block";
    scopeOutput.push(message, hiddenLet, hiddenConst);
  }
  scopeOutput.push(visibleVar);
}
readScopes();

addPage("Scope", "Scope tells us where a variable is available.", [
  ["Output", scopeOutput],
  ["Global", "It is available in the whole script."],
  ["Function", "It is available inside its function."],
  ["Block", "It is available inside braces such as an if block."],
  ["var, let, const", "var has function scope. let and const have block scope. const cannot be assigned again."]
]);

// task9
const createCounter = () => {
  let count = 0;
  return function () {
    count++;
    return count;
  };
};
const firstCounter = createCounter();
const counterHistory = [firstCounter(), firstCounter(), firstCounter()];
const otherCounter = createCounter();

const createAdder = value => number => value + number;
const addFive = createAdder(5);

addPage("Closure", "The inner function keeps access to variables from the outer function.", [
  ["Counter", counterHistory],
  ["New counter", otherCounter()],
  ["addFive(10)", addFive(10)],
  ["addFive(20)", addFive(20)]
]);

// task10
const list = [10, 20, 30, 40];
const [firstNumber, secondNumber] = list;
const simpleUser = { id: 1, name: "Anna", age: 21 };
const { name: simpleName, age: simpleAge } = simpleUser;
const longerList = [...list, 50];
const ageChanged = { ...simpleUser, age: 22 };
const emailAdded = { ...simpleUser, email: "anna@mail.com" };
const joinedLists = [...list, ...[60, 70]];

function sum(...numbers) {
  return numbers.reduce((answer, number) => answer + number, 0);
}

addPage("Destructuring, Spread and Rest", "These tools help me make copies and read values.", [
  ["First two", `${firstNumber}, ${secondNumber}`],
  ["Name and age", `${simpleName}, ${simpleAge}`],
  ["Add 50", longerList],
  ["Age 22", ageChanged],
  ["Email", emailAdded],
  ["Combined arrays", joinedLists],
  ["sum()", `${sum(1, 2)} and ${sum(1, 2, 3, 4)}`],
  ["Difference", "Spread gives separate values. Rest collects values into an array."]
]);

// task11
const people = [
  { name: "Ali", address: { city: "Almaty" } },
  { name: "Mira", address: null },
  { name: "Oleg" }
];
const cities = people.map(person => person.address?.city ?? "City not specified");
const testValues = [0, "", false, null, undefined].map(value => ({
  value: plainText(value),
  withOr: value || "default",
  withNullish: value ?? "default"
}));

addPage("Optional Chaining and Defaults", "Optional chaining is useful when a property may be missing.", [
  ["Direct city access", people[0].address.city],
  ["Cities", cities],
  ["Comparison", testValues],
  ["What I noticed", "|| replaces every falsy value. ?? only replaces null and undefined."]
]);

// finaltask
const courseStudents = [
  { id: 11, name: "Lina", age: 18, grades: [77, 82, 80] },
  { id: 12, name: "Amir", age: 19, grades: [58, 62, 55] },
  { id: 13, name: "Nura", age: 20, grades: [91, 88, 95] },
  { id: 14, name: "Ilya", age: 19, grades: [68, 73, 70] },
  { id: 15, name: "Eva", age: 18, grades: [45, 52, 48] }
];

function getAverage(grades) {
  return grades.reduce((total, grade) => total + grade, 0) / grades.length;
}
const getStudentAverage = student => getAverage(student.grades);
const getPassedStudents = students => students.filter(student => getStudentAverage(student) >= 60);
const getStudentNames = students => students.map(student => student.name);
const findStudent = (students, id) => students.find(student => student.id === id);
const getTopStudent = students => [...students].sort(
  (a, b) => getStudentAverage(b) - getStudentAverage(a)
)[0];

const report = courseStudents.map(student => {
  const average = getStudentAverage(student);
  return {
    id: student.id,
    name: student.name,
    average: Number(average.toFixed(1)),
    passed: average >= 60
  };
});

addPage("Final Task", "I used small functions to create one student report.", [
  ["Names", getStudentNames(courseStudents)],
  ["Passed", getPassedStudents(courseStudents).map(student => student.name)],
  ["Find ID 14", findStudent(courseStudents, 14)],
  ["Top student", getTopStudent(courseStudents)],
  ["Final array", report]
]);

// insights
const insights = {
  0: [
    ["1. What is the difference between let and const?", "let can get a new value. const cannot be assigned again."],
    ["2. What does typeof null return?", "It returns object."],
    ["3. What are JavaScript primitive types?", "string, number, bigint, boolean, undefined, symbol and null. Objects and arrays are reference values."]
  ],
  4: [
    ["Why did the original score change?", "copy and original point to the same object."],
    ["Why did the city change after spread?", "Spread made a shallow copy, so the address object was still shared."]
  ],
  6: [
    ["Can functions be stored in variables?", "Yes, a function can be stored in a variable."],
    ["Can functions be passed to other functions?", "Yes, a function can be passed as an argument."],
    ["What is the difference between add and add()?", "add is the function. add() runs the function."]
  ],
  7: [
    ["What is global scope?", "A global variable is available in the whole script."],
    ["What is function scope?", "A function variable is available only inside its function."],
    ["What is block scope?", "let and const inside a block stay inside that block."],
    ["What is the difference between var, let and const?", "var has function scope. let and const have block scope. const cannot be assigned again."]
  ],
  8: [
    ["Why can the inner function use count?", "It remembers variables from the outer function. This is a closure."]
  ],
  9: [
    ["What is the difference between spread and rest?", "Spread opens values. Rest collects values into an array."]
  ],
  10: [
    ["What is the difference between || and ??", "|| uses the default for every falsy value. ?? uses it only for null and undefined."]
  ]
};

const insightLabels = {
  4: ["Reason", "Why city changed"],
  6: ["Store and pass", "add and add()"],
  7: ["Global", "Function", "Block", "var, let, const"],
  9: ["Difference"],
  10: ["What I noticed"]
};

function plainText(value) {
  if (value === undefined) return "undefined";
  if (value === null) return "null";

  if (Array.isArray(value)) {
    const separator = value.some(item => typeof item === "object" && item !== null) ? " | " : ", ";
    return value.map(item => plainText(item)).join(separator);
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => `${key}: ${plainText(item)}`)
      .join(", ");
  }

  return String(value);
}

const taskList = document.querySelector("#task-list");

pages.forEach((page, index) => {
  const task = document.createElement("section");
  task.className = "task";
  const taskName = index === pages.length - 1 ? "Final Task" : `Task ${index + 1}`;

  const title = document.createElement("div");
  title.className = "task-title";
  title.innerHTML = `<h2>${taskName} - ${page.title}</h2>`;
  task.append(title);

  const results = document.createElement("div");
  results.className = "box results";

  const hiddenLabels = insightLabels[index] || [];
  page.answers
    .filter(([label]) => !hiddenLabels.includes(label))
    .forEach(([label, value]) => {
      const row = document.createElement("p");
      row.className = "answer-row";

      const labelElement = document.createElement("strong");
      labelElement.textContent = `${label}: `;
      row.append(labelElement, document.createTextNode(plainText(value)));
      results.append(row);
    });

  task.append(results);

  if (insights[index]) {
  const insightsBox = document.createElement("div");
  insightsBox.className = "box insights";
  insightsBox.innerHTML = "<h3>Insights</h3>";

  insights[index].forEach(([question, answer]) => {
    const item = document.createElement("div");
    item.className = "insight-item";

    const questionText = document.createElement("p");
    questionText.className = "insight-question";
    questionText.textContent = question;

    const answerText = document.createElement("p");
    answerText.className = "insight-answer";
    answerText.textContent = answer;

    item.append(questionText, answerText);
    insightsBox.append(item);
  });

  task.append(insightsBox);
}

  taskList.append(task);
});
