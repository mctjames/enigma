import React, { useState, useEffect } from 'react'

function Encode() {
    
    const [inputMessage, setMessage] = useState("");
    
    const [rotorOne, setRotorOne] = useState('I');
    const [rotorTwo, setRotorTwo] = useState('II');
    const [rotorThree, setRotorThree] = useState('III');

    const [initPosOne, setInitPosingOne] = useState('A')
    const [initPosTwo, setInitPosingTwo] = useState('A')
    const [initPosThree, setInitPosingThree] = useState('A')
    const [ringOne, setRingOne] = useState('A')
    const [ringTwo, setRingTwo] = useState('A')
    const [ringThree, setRingThree] = useState('A')
    const [reflector, setReflector] = useState('UKWB');



    useEffect(() => {
        isValidInput(inputMessage);
    }, [inputMessage, rotorOne, rotorTwo, rotorThree, initPosOne, initPosTwo, initPosThree, ringOne, ringTwo, ringThree, reflector])  //eslint-disable-line react-hooks/exhaustive-deps

    function isValidInput(inputMessage) {
        inputMessage = inputMessage.replace(/\s/g, '');
        if (/^[a-zA-Z]*$/g.test(inputMessage)){
            //console.log("its a valid input");
        }
        else{
            //console.log("error bad input")
            alert("Please use only the letters A-Z either upper or lower case.")
        }
    }

    // Historical Note: used Rotors from Enigma 1 Introduced in 1930. Rotors IV and V were introduced for the M3 Army Enigma in 1938 (https://en.wikipedia.org/wiki/Enigma_rotor_details)
    var defaultAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    var ringAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    var alphabetRight = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    var alphabetMiddle = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    var alphabetLeft = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

    var I     = "EKMFLGDQVZNTOWYHXUSPAIBRCJ".split('');
    var II    = "AJDKSIRUXBLHWTMCQGZNPYFVOE".split('');
    var III   = "BDFHJLCPRTXVZNYEIWGAKMUSQO".split('');
    var IV    = "ESOVPZJAYQUIRHXLNFTGKDCMWB".split('');
    var V     = "VZBRGITYUPSDNHLXAWMJQOFECK".split('');
    var UKWB = "YRUHQSLDPXNGOKMIEBFZCWVJAT".split('');
    var UKWC = "FVPJIAOYEDRZXWGCTKUQSBNMHL".split('');

    var rotorInputOne = eval(rotorOne)
    var rotorInputTwo = eval(rotorTwo)
    var rotorInputThree = eval(rotorThree)
    var reflectorInput = eval(reflector)

    // Turns the rotors but ignores the notches that force other rotors to change (I turns on Q, II on E...)
    function turnRotor(rotor, alphabet){
        //shift the corresponding default alphabet one value to the right
        var temp1 = alphabet[0];
        alphabet.shift();
        alphabet.push(temp1);
        //Shift the encoded rotor values one to the right
        var temp2 = rotor[0];
        rotor.shift();
        rotor.push(temp2);
    }

    // Rotor function that deals with the first rotor and its notch for adjusting the second rotor
    function turnRotorOne(rotor, alphabet, turnLetter) {
        //shift the corresponding default alphabet one value to the right
        var temp1 = alphabet[0];
        alphabet.shift();
        alphabet.push(temp1);
        //Shift the encoded rotor values one to the right
        var temp2 = rotor[0];
        rotor.shift();
        rotor.push(temp2);
        // the notched letter was turned from position 0 to 25. When we find the notched letter at pos 25 we need to turn the middle rotor
        
        if(alphabet[25] === turnLetter){
            if(rotorTwo === "I"){
                turnRotorTwo(rotorInputTwo, alphabetMiddle, "Q");
            }else if (rotorTwo === "II"){
                turnRotorTwo(rotorInputTwo, alphabetMiddle, "E");
            }
            else if (rotorTwo === "III"){
                turnRotorTwo(rotorInputTwo, alphabetMiddle, "V");
            }else if (rotorTwo === "IV"){
                turnRotorTwo(rotorInputTwo, alphabetMiddle, "J");
            }else if (rotorTwo === "V"){
                turnRotorTwo(rotorInputTwo, alphabetMiddle, "Z");
            }
        }
    }

    // rotor function that deals with the notch for rotor two
    function turnRotorTwo(rotor, alphabet, turnLetter){
        //shift the corresponding default alphabet one value to the right
        var temp1 = alphabet[0];
        alphabet.shift();
        alphabet.push(temp1);
        //Shift the encoded rotor values one to the right
        var temp2 = rotor[0];
        rotor.shift();
        rotor.push(temp2);

        // the notched letter was turned from position 0 to 25. When we find the notched letter at pos 25 we need to turn the final rotor
        if(alphabet[25] === turnLetter){
            turnRotor(rotorInputThree, alphabetLeft);
        }
    }

    // Turns the initial rotor Positions to the letters the user inputs
    function setInitialPosition(){
        while(initPosOne !== alphabetRight[0]){
            turnRotor(rotorInputOne, alphabetRight)
        }
        while(initPosTwo !== alphabetMiddle[0]){
            turnRotor(rotorInputTwo, alphabetMiddle)
        }
        while(initPosThree !== alphabetLeft[0]){
            turnRotor(rotorInputThree, alphabetLeft)
        }
    }

    function setRing(rotor, ringSetting){
        var newRotor = []
        for(let j = 0; j < rotor.length; j++){
            var letter = rotor[j]
            var index = defaultAlphabet.indexOf(rotor[j])
            if(index + ringSetting < 26){
                index = index + ringSetting
            }else{
                index = index + ringSetting - 26
            }
            letter = ringAlphabet[index]
            newRotor.push(letter)
        }
        rotor = newRotor
        for(let i = 0; i < ringSetting; i++){
            var temp = rotor[25];
            rotor.pop();
            rotor.unshift(temp);
        }
        //console.log("Turned rotor: ", rotor)
        return(rotor)
    }

    function encrypt(){
        var input = inputMessage.toUpperCase();
        var result = [];
        var letter = "";

        // Initial Position: Turn the Rotors to the desired start positions (If you set rotor One to "R" then R will be at position 0)
        setInitialPosition();
        
        // Ring Settings: Shift the connections of a rotor. If A -> K after the ring setting changes one position then K gets increased one
        // spot in the alphabet to L. Then the positions get rotated. See https://crypto.stackexchange.com/questions/29315/how-does-the-ring-settings-of-enigma-change-wiring-tables
        rotorInputOne = setRing(rotorInputOne, defaultAlphabet.indexOf(ringOne));
        rotorInputTwo = setRing(rotorInputTwo, defaultAlphabet.indexOf(ringTwo));
        rotorInputThree = setRing(rotorInputThree, defaultAlphabet.indexOf(ringThree));
      



        //loop through userInput (inputMessage)  
        for(let i = 0; i < input.length; i++){
            // turni the rotor after each key press of the user. 
            if(rotorOne === "I"){
                turnRotorOne(rotorInputOne, alphabetRight, "Q");
            }else if (rotorOne === "II"){
                turnRotorOne(rotorInputOne, alphabetRight, "E");
            }
            else if (rotorOne === "III"){
                turnRotorOne(rotorInputOne, alphabetRight, "V");
            }else if (rotorOne === "IV"){
                turnRotorOne(rotorInputOne, alphabetRight, "J");
            }else if (rotorOne === "V"){
                turnRotorOne(rotorInputOne, alphabetRight, "Z");
            }

            // The letter of the user input is passed through to the first rotor. Position of letter --> Find the corresponding letter in rotor I 
            // as the position of the letter in the original alphabet. Example: User Input "B" --> B is position 1 in the regular alhpabet. --> Letter at 
            // position 1 on Rotor I is "k". Therefore K is the current letter. This process repeats for each rotor 
            
            //step 1 get index of user input on a regular alphabet
            //console.log("Original input was: ", input[i])
            var letterIndex = defaultAlphabet.indexOf(input[i]);
            //console.log("letterIndex of input letter on a regular alphabet: ", letterIndex)

            //Right/fast rotor
            letter = alphabetRight[letterIndex]
            //console.log("letter @ right side of the first rotor: ", alphabetRight[letterIndex])
            letterIndex = alphabetRight.indexOf(letter)
            //console.log("letterIndex @ right side of first rotor: ", letterIndex)
            letter = rotorInputOne[letterIndex]
            //console.log("letter @ left side of first rotor: ", letter)
            letterIndex = alphabetRight.indexOf(letter)
            //console.log("letterIndex @ left side of first rotor: ", letterIndex)
            
            //Middle/medium rotor
            letter = alphabetMiddle[letterIndex]
            //console.log("letter @ right side of second rotor: ", letter)
            letterIndex = alphabetMiddle.indexOf(letter)
            //console.log("letterIndex @ right side of second rotor: ", letterIndex)
            letter = rotorInputTwo[letterIndex]
            //console.log("letter @ left side of second rotor: ", letter)
            letterIndex = alphabetMiddle.indexOf(letter)
            //console.log("letterIndex @ left side of second rotor: ", letterIndex)

            //Left/slow rotor
            letter = alphabetLeft[letterIndex]
            //console.log("letter @ right side of third rotor: ", letter)
            letterIndex = alphabetLeft.indexOf(letter)
            //console.log("letterIndex @ right side of third rotor: ", letterIndex)
            letter = rotorInputThree[letterIndex]
            //console.log("letter @ left side of third rotor: ", letter)
            letterIndex = alphabetLeft.indexOf(letter)
            //console.log("letterIndex @ left side of third rotor: ", letterIndex)

            // //The reflector. Here the letter that came from the left rotor is matched to a new cypther. UKW-B or UKW-C. This is standard cypher one for one. 
            // // The new letter is passed back into the rotor. 
            // // Note that this process now happens in reverse order. Rotor First then Alphabet. 
            letter = defaultAlphabet[letterIndex]
            //console.log("letter @ right side of reflector: ", letter)
            letterIndex = defaultAlphabet.indexOf(letter)
            //console.log("letterIndex @ right side of reflector: ", letterIndex)
            letter = reflectorInput[letterIndex]
            //console.log("letter @ left side of reflector: ", letter)
            letterIndex = defaultAlphabet.indexOf(letter)
            //console.log("letterIndex @ right side of the reflector: ", letterIndex)

            // We repeat the process of moving through the three rotors but this time from left to right. 
            //Left/slow rotor
            letter = alphabetLeft[letterIndex]
            //console.log("letter @ left side of third rotor: ", letter)
            letterIndex = rotorInputThree.indexOf(letter)
            //console.log("letterIndex @ left side of third rotor: ", letterIndex)
            letter = alphabetLeft[letterIndex]
            //console.log("letter @ right side of third rotor: ", letter)
            letterIndex = alphabetLeft.indexOf(letter)
            //console.log("letterIndex @ right side of third rotor: ", letterIndex)
            
            //middle/medium rotor
            letter = alphabetMiddle[letterIndex]
            //console.log("letter @ left side of mid rotor: ", letter)
            letterIndex = rotorInputTwo.indexOf(letter)
            //console.log("letterIndex @ left side of mid rotor: ", letterIndex)
            letter = alphabetMiddle[letterIndex]
            //console.log("letter @ right side of mid rotor: ", letter)
            letterIndex = alphabetMiddle.indexOf(letter)                           
            //console.log("letterIndex @ right side of mid rotor: ", letterIndex)
            
            //right/fast rotor
            letter = alphabetRight[letterIndex]
            //console.log("letter @ left side of right rotor: ", letter)
            letterIndex = rotorInputOne.indexOf(letter)
            //console.log("letterIndex @ left side of right rotor: ", letterIndex)
            letter = alphabetRight[letterIndex]
            //console.log("letter @ right side of right rotor: ", letter)
            letterIndex = alphabetRight.indexOf(letter)
            //console.log("letterIndex @ right side of right rotor: ", letterIndex)

            // output
            letter = defaultAlphabet[letterIndex]
            result.push(letter)
        }
        //console.log("result: ", result)
        return(result)
    }

    var output = encrypt();
    output = output.join("");
    //console.log("output: ", output)
   

    return (
        <div>
            <div className="input-section">
                <label>Code Input</label>   
                <input 
                    className="input-text" 
                    id="enigma-input" 
                    type="text" 
                    placeholder="Input"
                    onChange={(event) => setMessage(event.target.value)}
                />
            </div>
            <div className="output-section">
                <label>Code Output</label> 
                <p style={{color: "red"}}>{output}</p>
            </div>

            <h2>Rotors settings</h2>
            <div className="settings-subsection">
                <label><a href="https://en.wikipedia.org/wiki/Enigma_machine#Rotors">Rotor types (Walzenlage)</a></label>
                    <select 
                        className="rotor-type-settings" 
                        id="rotor-type-left"
                        defaultValue={rotorOne}
                        onChange={(event) => setRotorOne(event.target.value)}
                    >
                            <option value="alphabetRight">alphabetRight</option>
                            <option value="Alt">Alt</option>
                            <option value="Alt2">Alt2</option>
                            <option value="I">I</option>
                            <option value="II">II</option>
                            <option value="III">III</option>
                            <option value="IV">IV</option>
                            <option value="V">V</option>
                    </select>

                    <select 
                        className="rotor-type-settings" 
                        id="rotor-type-middle"
                        defaultValue={rotorTwo}
                        onChange={(event) => setRotorTwo(event.target.value)}
                    >
                            <option value="defaultAlfa">defaultAlfa</option>
                            <option value="Alt">Alt</option>
                            <option value="Alt2">Alt2</option>
                            <option value="I">I</option>
                            <option value="II">II</option>
                            <option value="III">III</option>
                            <option value="IV">IV</option>
                            <option value="V">V</option>
                    </select>

                    <select 
                        className="rotor-type-settings" 
                        id="rotor-type-right"
                        defaultValue={rotorThree}
                        onChange={(event) => setRotorThree(event.target.value)}
                    >
                            <option value="defaultAlfa">defaultAlfa</option>
                            <option value="Alt">Alt</option>
                            <option value="Alt2">Alt2</option>
                            <option value="I">I</option>
                            <option value="II">II</option>
                            <option value="III">III</option>
                            <option value="IV">IV</option>
                            <option value="V">V</option>
                    </select>
            </div>
            <div className="settings-subsection">
                <label><a href="https://en.wikipedia.org/wiki/Enigma_rotor_details#Rotor_offset">Initial Position (Grundstellung)</a></label>

                <select 
                    className="rotor-settings" 
                    id="rotor-left-pos"
                    defaultValue={initPosOne}
                    onChange={(event) => setInitPosingOne(event.target.value)}
                >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="G">G</option>
                        <option value="H">H</option>
                        <option value="I">I</option>
                        <option value="J">J</option>
                        <option value="K">K</option>
                        <option value="L">L</option>
                        <option value="M">M</option>
                        <option value="N">N</option>
                        <option value="O">O</option>
                        <option value="P">P</option>
                        <option value="Q">Q</option>
                        <option value="R">R</option>
                        <option value="S">S</option>
                        <option value="T">T</option>
                        <option value="U">U</option>
                        <option value="V">V</option>
                        <option value="W">W</option>
                        <option value="X">X</option>
                        <option value="Y">Y</option>
                        <option value="Z">Z</option>
                </select>

                <select 
                    className="rotor-settings" 
                    id="rotor-middle-pos"
                    defaultValue={initPosTwo}
                    onChange={(event) => setInitPosingTwo(event.target.value)}
                >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="G">G</option>
                        <option value="H">H</option>
                        <option value="I">I</option>
                        <option value="J">J</option>
                        <option value="K">K</option>
                        <option value="L">L</option>
                        <option value="M">M</option>
                        <option value="N">N</option>
                        <option value="O">O</option>
                        <option value="P">P</option>
                        <option value="Q">Q</option>
                        <option value="R">R</option>
                        <option value="S">S</option>
                        <option value="T">T</option>
                        <option value="U">U</option>
                        <option value="V">V</option>
                        <option value="W">W</option>
                        <option value="X">X</option>
                        <option value="Y">Y</option>
                        <option value="Z">Z</option>
                </select>

                <select 
                    className="rotor-settings" 
                    id="rotor-right-pos"
                    defaultValue={initPosThree}
                    onChange={(event) => setInitPosingThree(event.target.value)}
                >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="G">G</option>
                        <option value="H">H</option>
                        <option value="I">I</option>
                        <option value="J">J</option>
                        <option value="K">K</option>
                        <option value="L">L</option>
                        <option value="M">M</option>
                        <option value="N">N</option>
                        <option value="O">O</option>
                        <option value="P">P</option>
                        <option value="Q">Q</option>
                        <option value="R">R</option>
                        <option value="S">S</option>
                        <option value="T">T</option>
                        <option value="U">U</option>
                        <option value="V">V</option>
                        <option value="W">W</option>
                        <option value="X">X</option>
                        <option value="Y">Y</option>
                        <option value="Z">Z</option>
                </select>

            </div>
            <div className="settings-subsection">
                <label><a href="https://en.wikipedia.org/wiki/Enigma_rotor_details#Ring_setting">Ring settings (Ringstellung)</a></label>
                
                <select 
                    className="ring-settings" 
                    id="ring-left-pos"
                    defaultValue={ringOne}
                    onChange={(event) => setRingOne(event.target.value)}
                >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="G">G</option>
                        <option value="H">H</option>
                        <option value="I">I</option>
                        <option value="J">J</option>
                        <option value="K">K</option>
                        <option value="L">L</option>
                        <option value="M">M</option>
                        <option value="N">N</option>
                        <option value="O">O</option>
                        <option value="P">P</option>
                        <option value="Q">Q</option>
                        <option value="R">R</option>
                        <option value="S">S</option>
                        <option value="T">T</option>
                        <option value="U">U</option>
                        <option value="V">V</option>
                        <option value="W">W</option>
                        <option value="X">X</option>
                        <option value="Y">Y</option>
                        <option value="Z">Z</option>
                </select>
                <select 
                    className="ring-settings" 
                    id="ring-middle-pos"
                    defaultValue={ringTwo}
                    onChange={(event) => setRingTwo(event.target.value)}
                >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="G">G</option>
                        <option value="H">H</option>
                        <option value="I">I</option>
                        <option value="J">J</option>
                        <option value="K">K</option>
                        <option value="L">L</option>
                        <option value="M">M</option>
                        <option value="N">N</option>
                        <option value="O">O</option>
                        <option value="P">P</option>
                        <option value="Q">Q</option>
                        <option value="R">R</option>
                        <option value="S">S</option>
                        <option value="T">T</option>
                        <option value="U">U</option>
                        <option value="V">V</option>
                        <option value="W">W</option>
                        <option value="X">X</option>
                        <option value="Y">Y</option>
                        <option value="Z">Z</option>
                </select>
            
                <select 
                    className="ring-settings" 
                    id="ring-right-pos"
                    defaultValue={ringThree}
                    onChange={(event) => setRingThree(event.target.value)}
                >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="G">G</option>
                        <option value="H">H</option>
                        <option value="I">I</option>
                        <option value="J">J</option>
                        <option value="K">K</option>
                        <option value="L">L</option>
                        <option value="M">M</option>
                        <option value="N">N</option>
                        <option value="O">O</option>
                        <option value="P">P</option>
                        <option value="Q">Q</option>
                        <option value="R">R</option>
                        <option value="S">S</option>
                        <option value="T">T</option>
                        <option value="U">U</option>
                        <option value="V">V</option>
                        <option value="W">W</option>
                        <option value="X">X</option>
                        <option value="Y">Y</option>
                        <option value="Z">Z</option>
                </select>            
            
            </div>
            <h2>Reflector settings</h2>
            <div className="settings-subsection">
                <label><a href="https://en.wikipedia.org/wiki/Enigma_machine#Reflector">Reflector type (Umkehrwalze)</a></label>
                <select 
                    defaultValue={"UKWB"} 
                    className="reflector-settings" 
                    id="reflector-type"
                    onChange={(event) => setReflector(event.target.value)}
                >
                    <option value="UKWB">UkWB</option>
                    <option value="UKWC">UKWC</option>
                </select>
            </div>
            <h2>Plugboard settings</h2>
            <div className="settings-subsection">
                <label><a href="https://en.wikipedia.org/wiki/Enigma_machine#Plugboard">Plugboard connections (Steckerbrett)</a></label>
                <table className="plugboard-settings">
                    <tbody>
                        <tr>
                            <td>
                                <label>A</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-A" type="text"/>
                            </td>
                            <td>
                                <label>B</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-B" type="text"/>
                            </td>
                            <td>
                                <label>C</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-C" type="text"/>
                            </td>
                            <td>
                                <label>D</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-D" type="text"/>
                            </td>
                            <td>
                                <label>E</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-E" type="text"/>
                            </td>
                            <td>
                                <label>F</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-F" type="text"/>
                            </td>
                            <td>
                                <label>G</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-G" type="text"/>
                            </td>
                            <td>
                                <label>H</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-H" type="text"/>
                            </td>
                            <td>
                                <label>I</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-I" type="text"/>
                            </td>
                            <td>
                                <label>J</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-J" type="text"/>
                            </td>
                            <td>
                                <label>K</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-K" type="text"/>
                            </td>
                            <td>
                                <label>L</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-L" type="text"/>
                            </td>
                            <td>
                                <label>M</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-M" type="text"/>
                            </td>
                            
                        </tr>
                        <tr>
                            <td>
                                <label>N</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-N" type="text"/>
                            </td>
                            <td>
                                <label>O</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-O" type="text"/>
                            </td>
                            <td>
                                <label>P</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-P" type="text"/>
                            </td>
                            <td>
                                <label>Q</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-Q" type="text"/>
                            </td>
                            <td>
                                <label>R</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-R" type="text"/>
                            </td>
                            <td>
                                <label>S</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-S" type="text"/>
                            </td>
                            <td>
                                <label>T</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-T" type="text"/>
                            </td>
                            <td>
                                <label>U</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-U" type="text"/>
                            </td>
                            <td>
                                <label>V</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-V" type="text"/>
                            </td>
                            <td>
                                <label>W</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-W" type="text"/>
                            </td>
                            <td>
                                <label>X</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-X" type="text"/>
                            </td>
                            <td>
                                <label>Y</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-Y" type="text"/>
                            </td>
                            <td>
                                <label>Z</label>
                                <input className="plugboard-letter-settings" id="plugboard-letter-Z" type="text"/>
                            </td>
                        </tr>
                    </tbody>    
                </table>
            </div>
        </div>
    )
}

export default Encode
