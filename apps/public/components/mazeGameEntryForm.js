"use client"
import { useState } from 'react'

export default function EntryForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [touched, setTouched] = useState({ name: false, phone: false })

  const isNameValid = name.trim() !== ''
  const isPhoneValid = phone.trim() !== ''

  const handleSubmit = e => {
    e.preventDefault()
    setTouched({ name: true, phone: true })
    if (isNameValid && isPhoneValid) {
      onSubmit({ name: name.trim(), phone: phone.trim() })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, name: true }))}
          className={`w-full border rounded px-3 py-2 ${
            touched.name && !isNameValid ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {touched.name && !isNameValid && (
          <p className="text-red-500 text-sm mt-1">Name is required.</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="phone">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, phone: true }))}
          className={`w-full border rounded px-3 py-2 ${
            touched.phone && !isPhoneValid ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {touched.phone && !isPhoneValid && (
          <p className="text-red-500 text-sm mt-1">Phone number is required.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!(isNameValid && isPhoneValid)}
        className={`w-full py-2 rounded text-white ${
          isNameValid && isPhoneValid
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Submit
      </button>
    </form>
  )
}
