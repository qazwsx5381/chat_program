const todoInput = document.querySelector('#todo_input')
const addButton = document.querySelector('#todo_send')
const todoDiv = document.querySelector('#todo_div')

document.addEventListener("DOMContentLoaded",getLocal)
addButton.addEventListener('click',addTodo)
todoDiv.addEventListener('click',manageTodo)

//엔터키 작동
todoInput.addEventListener('keyup',(e)=>{
    inputData = e.target.value
    if(e.key==="Enter")addTodo(inputData)
})

// 필드에 내용 입력하기
function addTodo(e){
    //e.preventDefault();

    const newDiv = document.createElement('div')
    newDiv.classList.add('todo_div')
    const newTodo = document.createElement('p')
    newTodo.innerText = todoInput.value
    console.log(todoInput.value)
    newTodo.classList.add('todo-content')
    newDiv.appendChild(newTodo)

    saveToLocal(todoInput.value)
    
    const completeButton = document.createElement('button')
    completeButton.innerText = '완료'
    completeButton.classList.add('complete-button')
    newDiv.appendChild(completeButton)

    const deleteButton = document.createElement('button') 
    deleteButton.innerText = '삭제'
    deleteButton.classList.add('delete-button')
    newDiv.appendChild(deleteButton)
     todoDiv.appendChild(newDiv)
     todoInput.value = ""
}

//로컬에 저장하기
function saveToLocal(todo){
    let todos
    if(localStorage.getItem('todos')===null){
        todos = []
    }else{
        todos = JSON.parse(localStorage.getItem('todos'))
    }

    todos.push(todo)
    localStorage.setItem('todos',JSON.stringify(todos))
}

//로컬스토리지 내용 가져와서 화면에 표시하기
function getLocal(){
    let todos
    if(localStorage.getItem('todos')===null){
        todos = []
    }else{
        todos = JSON.parse(localStorage.getItem('todos'))
    }

    todos.forEach(function(todo){
        const newDiv = document.createElement('div')
        newDiv.classList.add('todo_div')
        const newTodo = document.createElement('p')
        newTodo.innerText = todo
        newTodo.classList.add('todo-content')
        newDiv.appendChild(newTodo) 

        const completeButton = document.createElement('button')
        completeButton.innerText = '완료'
        completeButton.classList.add('complete-button')
        newDiv.appendChild(completeButton)

        const deleteButton = document.createElement('button') 
        deleteButton.innerText = '삭제'
        deleteButton.classList.add('delete-button')
        newDiv.appendChild(deleteButton)
        
        todoDiv.appendChild(newDiv)
     
        todoInput.value = ""
    })
    
}

//완료/삭제 버튼 정의
function manageTodo(e){
    const whichButton = e.target.classList[0] //클릭한 부분의 클래스 가져오기
    if(whichButton === 'complete-button'){
        const todo = e.target.parentElement
        todo.children[0].classList.toggle('completed')
    }else if(whichButton === 'delete-button'){
        const todo = e.target.parentElement
        removeLocal(todo)
        todo.remove()
    }
}

function removeLocal(todo){
    let todos
    if(localStorage.getItem('todos')===null){
        todos = []
    }else{
        todos = JSON.parse(localStorage.getItem('todos'))
    }
    
    console.log(todo)
    const index = todos.indexOf(todo.children[0].innerText)
    console.log(index)

    todos.splice(index,1)
    localStorage.setItem('todos',JSON.stringify(todos))
}