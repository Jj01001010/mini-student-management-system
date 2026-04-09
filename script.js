// Simple login auth
const userNameLogIn = document.querySelector(".user-name-login")
const userPasswordLogIn = document.querySelector(".user-pass-login")
const login = document.getElementById("login-form")
const loginSection = document.querySelector(".div-div")
const appSection = document.querySelector(".app-section")

const users =  [
    {username: "admin1", password: "ilovejs123"}
];

const currentUser = localStorage.getItem("currentUser")

    if(currentUser){
        loginSection.classList.add("hidden")
        appSection.classList.remove('hidden')
    } else {
        appSection.classList.add('hidden')
        loginSection.classList.remove("hidden")
    }

function userAuth(){

    const logInUsername = userNameLogIn.value.trim()
    const logInPassword = userPasswordLogIn.value.trim()

    if(logInUsername === "" || logInPassword  === "") return;

    const findUser = users.find(user => {
        return user.username === logInUsername && user.password === logInPassword 
    })

    if(findUser){
        localStorage.setItem("currentUser", findUser.username)

        loginSection.classList.add('hidden')
        appSection.classList.remove('hidden')
        
        userNameLogIn.value = ""
        userPasswordLogIn.value = ""

        alert(`Welcome Back ${findUser.username}`)
    } else{
        alert("Invalid credentials.")
        userPasswordLogIn.value = ""
    }
}

login.addEventListener("submit", (e) => {
    e.preventDefault()
    userAuth()
})

// Displaying Current Time & Date
const timeNow = setInterval(() => {
    const now = new Date()
    const timeString  = now.toLocaleTimeString();
    document.querySelector(".clock").innerHTML = timeString
}, 1000)

const date = new Date()
document.querySelector(".date").innerHTML = date.toLocaleDateString
('default', {month: 'long', day: 'numeric', year: 'numeric'})

// Student data (CRUD)
const nameEl = document.querySelector(".name-el")
const ageEl = document.querySelector(".age-el")
const courseEl = document.querySelector(".course-el")
const addBtn = document.querySelector(".add-btn")

const searchEl = document.querySelector(".search-el")
const output = document.querySelector(".output-el")

const studentContainer = document.querySelector(".student-container")
const form = document.getElementById("add-form")
const logoutBtn = document.querySelector(".logout-button")
const studentCount = document.querySelector(".student-count")
const plusBtn = document.querySelector(".plus-btn")
const formContainer = document.querySelector(".form-container")
const cancelBtn = document.querySelector(".cancel-btn")

const studentBody = document.getElementById("studentBody")
const courseCount = document.querySelector(".course-count")

const mobileNum = document.querySelector(".phoneNum-el")
const email = document.querySelector(".email-el")

const highestContainer = document.querySelector(".highest-course-container")
const highestEl = document.querySelector(".highest-course")

let student = [];
let editingStudentId = null;
let isFound = false

plusBtn.addEventListener('click', (e) =>{
    e.preventDefault()
    formContainer.classList.remove('hidden')
})

cancelBtn.addEventListener('click', (e) =>{
    e.preventDefault()
    formContainer.classList.add('hidden')
    form.reset()
    editingStudentId = null
    addBtn.textContent = "ADD STUDENT"
})


const getData = JSON.parse(localStorage.getItem("students"))
student = getData || []
renderStudents()
updateUI()

function saveData(){
    localStorage.setItem("students", JSON.stringify(student))
}

function addStudent(){
    const addName = nameEl.value.trim()
    const addAge = ageEl.value.trim()
    const addCourse = courseEl.value.trim()
    const addNumber = mobileNum.value.trim()
    const addEmail = email.value.trim()

    if(addName === "" || addName.match(/\d/) !== null || isNaN(addAge) || addCourse === "" || isNaN(addNumber)){
        alert('Invalid input')
        return
    }
    student.push({
        student_id: Date.now(),
        student_name: addName,
        student_age: addAge,
        student_course: addCourse,
        student_number: addNumber,
        student_email: addEmail
    })

    formContainer.classList.add('hidden')
    updateUI()
    saveData()
}

studentBody.addEventListener('click', (e) => {
    const button = e.target.closest("button")
    if(!button) return;

    const studentId = Number(button.dataset.studentId)
    const action = button.dataset.action

    if(!studentId || isNaN(studentId) || student.length <= 0 ) return
    
    if(action === "edit"){
        editStudent(studentId)
    }
    if(action === "delete"){
    
        Swal.fire({
        title: 'Are you sure?',
        text: "This student will be deleted permanently!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it',
        cancelButtonText: 'No, cancel',
        }).then((result) =>{
            if(result.isConfirmed){
                deleteStudent(studentId)
            }
        }) 
    }
})

function deleteStudent(id){
    student = student.filter(student => student.student_id !== id)
    nameEl.value = ""
    ageEl.value = ""
    courseEl.value = ""
    renderStudents()
    updateUI()
    saveData()
}

form.addEventListener("submit", (e) => {
    e.preventDefault()

    if(editingStudentId !== null){
        const findData = student.find(id => id.student_id === editingStudentId)
        if(!findData) return;

        formContainer.classList.add('hidden')
        findData.student_name = nameEl.value
        findData.student_age = ageEl.value
        findData.student_course = courseEl.value
        findData.student_number = mobileNum.value
        findData.student_email = email.value
        editingStudentId = null;
        addBtn.innerHTML = "Add student"
        saveData()

    } else {
        addStudent()    
    }
    updateUI()
    renderStudents();
    form.reset()
})

function getCommonCourse(list = []){

    let courseCounter = {}
    let highest = 0
    let topCourse = null

    list.forEach((s) => {
        const course = s.student_course

        courseCounter[course] = (courseCounter[course] || 0) + 1
 
        if(courseCounter[course] > highest){
            highest = courseCounter[course]
            topCourse = course
        }
    })

    return {course: topCourse, count: highest}
}

function renderedCommonCourse(commonCourse){

    if(commonCourse.course === null){
        highestEl.innerHTML = `
        <strong>No data</strong>
    `       
    } else{
    highestEl.innerHTML = `
        <strong>${commonCourse.course}: ${commonCourse.count}</strong>
    ` 
    }      
}

function updateUI(){
    const commonCourse = getCommonCourse(student)
    renderedCommonCourse(commonCourse)
}

function renderStudents(list = student){
    
    courseCount.innerHTML = `
    <i class="fa-solid fa-book-open"></i>
        <span>
            ${list.length}
        </span>`
 
    studentCount.innerHTML = `
       <i class="fas fa-users"></i>
        <span>
            ${list.length}
        </span>`

    if(list.length === 0){
       studentBody.innerHTML = `
        <tr>
            <td class="no-data" colspan="12">No student Record</td>
        </tr>
       `
     } else {
        studentBody.innerHTML = list.map(s => {
        return `
                <tr>
                    <td>${s.student_id}</td>
                    <td>${s.student_name}</td>
                    <td>${s.student_age}</td>
                    <td>${s.student_course}</td>
                    <td>${s.student_number}</td>
                    <td>${s.student_email}</td>
                    <td class="actions-btn">
                        <button class="edit-btn" data-action="edit" data-student-id="${s.student_id}">
                                <i class="fas fa-edit"></i>
                                
                        </button>
                        <button class="delete-btn" data-action="delete" data-student-id="${s.student_id}">
                            <i class="fa fa-trash"></i>                 
                        </button>
                    </td>
                </tr>
        `
        }).join("")
    }
}

function findStudent(){
    const searchValue = searchEl.value.toLowerCase()

    const filteredStudents = student.filter(s => {
        return s.student_name.toLowerCase().includes(searchValue)
        }
    )
       
    if(filteredStudents.length === 0){
        studentBody.innerHTML = `<td class="no-data" colspan="12">No match student</td>`
    } else {
         renderStudents(filteredStudents)
    }
}

searchEl.addEventListener("input", findStudent)

function editStudent(id){
    const data = student.find(s => s.student_id === id)

    if(!data) return

    nameEl.value = data.student_name
    ageEl.value = data.student_age
    courseEl.value = data.student_course
    mobileNum.value = data.student_number
    email.value = data.student_email
    formContainer.classList.remove('hidden')
    editingStudentId = id
    addBtn.innerHTML = "SAVE EDIT"
    saveData()
}

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault()

      Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, log me out',
        cancelButtonText: 'No, cancel',
        }).then((result) =>{
            if(result.isConfirmed){
                localStorage.removeItem("currentUser")
                loginSection.classList.remove('hidden')
                appSection.classList.add("hidden")
            }
        }
    ) 
})          









