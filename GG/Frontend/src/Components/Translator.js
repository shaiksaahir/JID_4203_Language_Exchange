import { useState } from 'react';
import React from "react";
import './Registration.css'; 
import './Dashboard.css'; 
import './Translator.css';
import Button from 'react-bootstrap/Button';
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";
import translate from 'translate'; // imports the translator module which supports four different translation engines
import { handleTranslator } from '../Services/userService';

function Translator() {
    const[search] = useSearchParams();
    const navigate = useNavigate();
    const id = search.get("id");
    const Translator2 = async(e) => {
        navigate({
          pathname: "/Translator2",
          search: createSearchParams({
              id: id
          }).toString()
      });
    }
    const translateButton = async (button) => {
        console.log("Translate pressed", button);
        const text = await translate(input, {to: "ko", from: "en"}); // uses default google translation engine since no other engine was specified
        setInput(text)
    }
    const saveButton = async (button) => {
        console.log("Save pressed", button);
        const text1 = await translate(input, {to: "en", from: "ko"});
        const text2 = await translate(input, {to: "ko", from: "en"});
        let data = await handleTranslator(text1, text2);
    }
    const [input, setInput] = useState("");
    const onClick = button => {
        console.log("Button pressed", button);
        setInput(input + button.target.innerHTML.toLowerCase())
    };
    const onSpace = button => {
        console.log("Space pressed", button);
        setInput(input + " ")
    };
    const onBack = button => {
        console.log("Backspace pressed", button);
        setInput(input.substring(0, input.length - 1))
    };
    const onChangeInput = event => {
        const input = event.target.value;
        setInput(input);
    };
    const onClear = button => {
        console.log("Clear pressed", button);
        setInput("")
    };

    const handleBack = async (e) => {
        navigate({
          pathname: "/Dashboard",
          search: createSearchParams({
            id: id
          }).toString()
        });
      };

    return (
        <div className="screen-Background">
        <div  className="screen-Container" style={{ justifyContent: 'center' }}>
        <div className="screen-Content">
      
        <h1 className="centered">Translator</h1>
        <div className="textarea">
            <textarea
            value={input}
            onChange={onChangeInput}
            ></textarea>
        </div>
        <button className="trnslt" onClick={translateButton}>Translate</button>
        <button className="save" onClick={saveButton}>Save Translation</button>
        <button className="clear" onClick={onClear}>Clear</button>
        <div class="keyboard">
        <div class="row row1">
            <button onClick={onClick}>Q</button>
            <button onClick={onClick}>W</button>
            <button onClick={onClick}>E</button>
            <button onClick={onClick}>R</button>
            <button onClick={onClick}>T</button>
            <button onClick={onClick}>Y</button>
            <button onClick={onClick}>U</button>
            <button onClick={onClick}>I</button>
            <button onClick={onClick}>O</button>
            <button onClick={onClick}>P</button>
        </div>
        <div class="row row2">
            <button onClick={onClick}>A</button>
            <button onClick={onClick}>S</button>
            <button onClick={onClick}>D</button>
            <button onClick={onClick}>F</button>
            <button onClick={onClick}>G</button>
            <button onClick={onClick}>H</button>
            <button onClick={onClick}>J</button>
            <button onClick={onClick}>K</button>
            <button onClick={onClick}>L</button>
        </div>
        <div class="row row3">
            <button onClick={onClick}>Z</button>
            <button onClick={onClick}>X</button>
            <button onClick={onClick}>C</button>
            <button onClick={onClick}>V</button>
            <button onClick={onClick}>B</button>
            <button onClick={onClick}>N</button>
            <button onClick={onClick}>M</button>
        </div>
        <div class="row row4">
            <div class="space" id="space" onClick={onSpace}>Space</div>
            <div class="backspace" id="backspace" onClick={onBack}>Backspace</div>
        </div>
        <div>
      <Button className="btn-help" onClick={handleBack}>Back</Button>
      </div>
    </div>
        </div></div></div>
    );
}
export default Translator;