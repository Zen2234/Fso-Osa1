import { useState, useEffect } from 'react'
import personService from './persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification(message)
    setNotificationType(type)
    setTimeout(() => {
      setNotification(null)
    }, 3000) 
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (!newName || !newNumber) {
      showNotification('Please fill in both name and number', 'error')
      return
    }

    if (persons.some(person => person.name === newName)) {
      showNotification(`${newName} is already added to phonebook`, 'error')
      return
    }

    const newPerson = { name: newName, number: newNumber }

    personService.create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showNotification(`Added ${returnedPerson.name}`)
      })
      .catch(err => {
        console.error(err)
        showNotification('Error adding person', 'error')
      })
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showNotification(`Deleted ${name}`)
        })
        .catch(err => {
          console.error(err)
          setPersons(persons.filter(p => p.id !== id))
          showNotification(`Information of ${name} has already been removed`, 'error')
        })
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification} type={notificationType} />

      <div>
        filter shown with{' '}
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      <h3>Add a new</h3>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={e => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={e => setNewNumber(e.target.value)} />
        </div>
        <button type="submit">add</button>
      </form>

      <h3>Numbers</h3>
      <div>
        {personsToShow.map(person => (
          <li key={person.id}>
            {person.name} {person.number}{' '}
            <button onClick={() => handleDelete(person.id, person.name)}>Delete</button>
          </li>
        ))}
      </div>
    </div>
  )
}

export default App









