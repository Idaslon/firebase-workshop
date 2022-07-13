// Wrong Way!!!

import { FormEvent, useCallback, useEffect, useState } from "react"
import { firestore } from "../services/firebase"

type User = {
  id: string
  name: string
}

function transformUser(user: any) {
  const formattedUser = {
    id: user.id,
    ...user.data(),
  }

  return formattedUser as User
}

function Index() {
  const [users, setUsers] = useState<User[]>([])
  const [value, setValue] = useState('')

  const handleSubmit = useCallback(async(event: FormEvent) => {
    event.preventDefault()
    
    await firestore.collection('users').add({ name: value })

    setValue('')
  }, [value])

  const handleUpdateUser = useCallback(async (userId: string) => {
    firestore.doc(`/users/${userId}`).update({ name: 'Monkey' })
  }, [])

  const handleDeleteUser = useCallback(async (userId: string) => {
    firestore.doc(`/users/${userId}`).delete()
  }, [])

  useEffect(() => {
    async function loadAndSetUsers() {
      const response = await firestore.collection('users').get()
      const listedUsers = response.docs.map(transformUser)

      setUsers(listedUsers)
    }

    loadAndSetUsers()
  }, [])

  console.log(users);
  

  return (
    <div>
      <h1>Firebase workshop! 🚀</h1>

      <form onSubmit={handleSubmit}>
        <input type="text" onChange={(event) => setValue(event.target.value)}/>
        <button type="submit">Submit</button>
      </form>

      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name}

            <button onClick={() => handleUpdateUser(user.id)}>Turn into a Monkey</button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Index
