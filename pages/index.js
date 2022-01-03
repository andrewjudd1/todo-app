import {useState, useEffect, useRef} from 'react'
import { useStateWithCallbackLazy } from '../utils/useStateCallbacks'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
const rootUrl= 'https://todo-server-andrew.herokuapp.com/api/v1'
export default function Home() {
  
const [person, setPerson] = useState('')
const [users, setUsers] = useState([])
const [userUpdate, setUserUpdate] = useState('')
const [userDelete, setUserDelete] = useState('')
const [id, setId] = useState('')
const [completed, setCompleted] = useState(false)
const [render, setRender] = useState(false)
const [edit, setEdit] = useState(false)
const inputRef = useRef()

useEffect(() => {
  const getUsers = async () => {
    const url = `${rootUrl}/users`
    try {
     let response = await fetch(url) 
     let data = await response.json()
     let users = data.users
     console.log(users)
     setUsers(users)

     
    } catch (error) {
      console.log(error)
    }
  }
  getUsers()
}, [render])


const handleSubmit = async (e) => {
  e.preventDefault()
 
  const user = {
    name: person,
    completed: false,
  }
  try {
    const url=`${rootUrl}/users`
   const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    })
    setPerson('')
    setRender(!render)
    console.log("user Submitted")
  } catch (error) {
    console.log(error)
  }
}

const handleUpdate = async () => {
  try {
    
     let userPatch = {
       updateId: id,
       name: userUpdate,
       completed: completed,
     }
    const url=`${rootUrl}/users`
   await fetch(url, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userPatch)
    })
    setRender(!render)
    console.log("user updated")
    setEdit('')
    setUserUpdate('')
  } catch (error) {
    console.log(error)
  }

}

const handleDelete = async () => {
              
  
  try {
    
      console.log(userDelete)
       const userToDelete = {
         nameId: userDelete
       }
      const url=`${rootUrl}/users`
     await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToDelete)
      })
      setRender(!render)
      console.log("user Deleted")
    } catch (error) {
      console.log(error)
    }
  }




  return (
    
    <>
    <div className={styles.taskCreatorContainer}>
    <h1 className={styles.todoTitle}>Task Manager</h1>
    <form className={styles.formContainer} onSubmit={handleSubmit}>
    <input placeholder='e.g. wash dishes' className={styles.taskCreatorInput}value={person} onChange={(e) => setPerson(e.target.value)}/>
    <button className={styles.taskCreatorButton} ref={inputRef}>Add Task</button>
    </form>
    </div>
    <section>
      <h2 className={styles.allTasksTitle}> Tasks </h2>
      
      <div className={styles.allTasksContainer}>
        {users.map(user => {
          return (
            
            
          <div className={styles.taskContainer} key={user._id}>
           
           {user.completed ? 
           <CheckCircleIcon  onMouseDown={() => {
            setId(user._id)
            setUserUpdate(user.name)
            setCompleted(false)}}
          onMouseUp={handleUpdate}/> 
           : <RadioButtonUncheckedIcon 
           onMouseDown={() => {
             setId(user._id)
             setUserUpdate(user.name)
             setCompleted(true)}}
           onMouseUp={handleUpdate}
           />}
          
            {edit === user._id ? 
            <input ref={inputRef} className={styles.taskInput} value={userUpdate} onChange={({target}) => {
              
              setUserUpdate(target.value)}}/> : 
            <div className={styles.task, user.completed ? styles.taskCompleted : null}> {user.name} </div>}
            
            <div>
            {edit === user._id ? <SaveIcon onClick={handleUpdate}/> :
            <EditIcon onClick={() => {
             
              setUserUpdate(user.name)
              setEdit(user._id)
              setId(user._id)
              
            }}/>
          }
            <DeleteIcon onMouseDown={() =>
              setUserDelete(user._id)
              } onMouseUp={handleDelete}
              
            />
            </div>
            </div>
          
          
          )
        })}
      </div>
    </section>
    </>
    )
}
