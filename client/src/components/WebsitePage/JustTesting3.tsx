import React from 'react'

const JustTesting3 = () => {

  return (
    <div>
        <button onClick={() => console.log(process.env.NEXT_PUBLIC_BASE_URL)}>Env variable</button>
    </div>
  )
}

export default JustTesting3