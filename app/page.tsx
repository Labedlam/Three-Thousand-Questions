"use client"
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { isNull } from 'util'
//create a debounce hook
function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    //set timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    //clear timeout
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function Home() {
  const [question, setQuestion] = useState('')
  const [questionLength, setQuestionLength] = useState(0)
  const [numberSelection, setNumberSelection] = useState<number|null>(0)
  const debouncedNumberSelection = useDebounce(numberSelection, 100)

  // get local api url
  const url = process.env.NEXT_PUBLIC_API_URL
  useEffect(() => {
    fetch(`${url}/questions`)
      .then((response) => response.json())
      .then((data) => {
        setQuestionLength(data.length)
      })
  }, [])

  //function to validate number is from 1 to 3000
  function validateNumber(num:number) {
    if (isNaN(num)) {
      return false
    }
    if (num < 1 || num > 3000) {
      return false
    }
    return true
  }

  //function handle number input
  function handleNumberInput(e: React.ChangeEvent<HTMLInputElement>) {
    const num = Number(e.target.value)
    
    if (validateNumber(num)) {
      setNumberSelection(num)
    }
    //if not a number or zero, set to 1
    else {
      setQuestion('')
      setNumberSelection(null)
    }
  }

  //function to handle submit
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    //if number is valid, fetch question
    if (validateNumber(debouncedNumberSelection)) {
      fetch(`${url}/questions?num=${debouncedNumberSelection}`)
        .then((response) => response.json())
        .then((data) => {
          setQuestion(data.result)
        })
    }

    //if not valid, fetch default question
    // else {
    //   fetch(`${url}/api/questions?num=1`)
    //     .then((response) => response.json())
    //     .then((data) => {
    //       setQuestion(data.results)
    //     })
    // }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* number input that allows limits between 1 and 3000 with label "Pick a number" , adds invalid tailwind class when value is null or 0*/}

      {/* <div className="flex flex-col items-center justify-center">
        <label className="text-xl font-bold">Enter a number up till 3000</label>
        <input
        // add tailwind border red when invalid
          className={numberSelection === null ? "border-2 border-red-500 rounded-lg p-2 m-2" : "border-2 border-black rounded-lg p-2 m-2"}
          type="number"
          min="1"
          max="3000"
          value={numberSelection}
          onChange={(e) => handleNumberInput(e)}
          // className="border-2 border-black rounded-lg p-2 m-2"
        />
      </div> */}
      
      {/* tailwind form that takes max width when small, and centered as it grows */}
      <div className="flex flex-col items-center justify-center">
        <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
          {/* tailwind label for number input */}
          <label className="text-xl font-bold">Enter a number up to {questionLength}</label>
          {/* tailwind input for number input */}
          <input
            className="border-2 border-black rounded-lg p-2 m-2"
            type="number"
            min="1"
            max={questionLength}
            value={numberSelection}
            onChange={(e) => handleNumberInput(e)}
            disabled={questionLength === 0}
          />
        </form>
      </div>

      {/* display the question result */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">{question}</h1>
        </div>
   
    </main>
  )
}
