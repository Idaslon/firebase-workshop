import { FormEvent, useCallback,  useMemo,  useState } from "react"
import { firestore } from "../services/firebase"
import { useCollection } from 'react-firebase-hooks/firestore';

	
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

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

// The right thing is use on .env
const searchClient = algoliasearch('SDBXNFH1GW', '54c78d7836f1e689e9ba8e85c77ae524');

function Index() {
  const [value, setValue] = useState('')
  const [usersData, loading, error] = useCollection(firestore.collection('users'))

  const handleSubmit = useCallback(async(event: FormEvent) => {
    event.preventDefault()
    
    await firestore.collection('users').add({ name: value })

    setValue('')
  }, [value])

  const handleUpdateUser = useCallback(async (userId: string) => {
    await firestore.doc(`/users/${userId}`).update({ name: 'Monkey' })
  }, [])

  const handleDeleteUser = useCallback(async (userId: string) => {
    await firestore.doc(`/users/${userId}`).delete()
  }, [])

  const users = useMemo(() => {
    return usersData?.docs.map(transformUser)
  }, [usersData])

  if (loading) {
    return <h1>Loading</h1>
  }
  
  if (error) {
    return <h1>{`An error has ocurred: ${error.message}`}</h1>
  }

  console.log(users);
  

  return (
    <div>
      <h1>Firebase workshop! 🚀</h1>

      <form onSubmit={handleSubmit}>
        <input type="text" onChange={(event) => setValue(event.target.value)}/>
        <button type="submit">Submit</button>
      </form>

      <ul>
        {users?.map(user => (
          <li key={user.id}>
            {user.name}

            <button onClick={() => handleUpdateUser(user.id)}>Turn into a Monkey</button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>

      	
      <InstantSearch searchClient={searchClient} indexName="users">
        <SearchBox />
        <Hits hitComponent={props => <div>{props.hit.name}</div>} />
      </InstantSearch>
    </div>
  )
}

export default Index
