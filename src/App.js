import React from 'react'

import Header from './components/Header'
import Encode from './components/Encode'

// import Input from './components/settings/Input';
// import RotorTypes from './components/settings/RotorTypes';
// import GroundSettings from './components/settings/GroundSettings';
// import RingSettings from './components/settings/RingSettings';
// import ReflectorSettings from './components/settings/ReflectorSettings';
// import PlugboardSettings from './components/settings/PlugboardSettings';
//import Output from './components/Output';
// import Decoded from './components/Decoded';

function App() {

  // // grab the user user input for the coded message from Input.js
  // const userTextInput = (inputMessage) => {
  //   console.log("Input output appside: ", inputMessage)
  // }
  // const userRotorInput = (rotorOne) => {
  //   console.log("Rotor outputs App side: ", rotorOne)
  // }
  // const userInitPos = (initPosOne) => {
  //   console.log("Initial position set to: ", initPosOne)
  // }
  // const userRingSettings = (ringOne) => {
  //   console.log("Ring settings app side:  ", ringOne )
  //   //return(ringOne)
  // }
  
  // let userReflector = (reflector) => {
  //   console.log("Reflector Setting app side:  ", reflector.reflector )
  //   console.log("Reflector Setting app side:  ", reflector )
  //   console.log("testing grounds: ", )
  // }

  return (
    <div className="container">
      <Header  />
      <Encode />

      {/* <Input  userTextInput={userTextInput} />
      <RotorTypes userRotorInput={userRotorInput}/>
      <GroundSettings userInitPos={userInitPos}/>
      <RingSettings userRingSettings={userRingSettings}/> 
      <ReflectorSettings userReflector={userReflector}/>
      <Output />
      <Decoded />
      <PlugboardSettings /> */}
 
    </div>
  );
}

export default App;
