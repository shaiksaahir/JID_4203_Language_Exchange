import { useState } from 'react';
import React from "react";
import './Registration.css'; 
import Button from 'react-bootstrap/Button';
import { HelpData } from './HelpData';
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import {IconContext} from 'react-icons';
import {FiPlus, FiMinus} from 'react-icons/fi';

const AccordionSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100vh;
  background: #fff;
`;

const Container = styled.div`
  top: 30%;
  box-shadow: 2px 10px 35px 1px rgba(153, 153, 153, 0.3);
`;

const Wrap = styled.div`
  background: linear-gradient(135deg, rgba(34,193,195,1) 50%,     rgba(253,187,45,1) 100%);;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-align: center;
  cursor: pointer;
  h1 {
    padding: 2rem;
    font-size: 1rem;
  }
  span {
    margin-right: 1.5rem;
  }
`;

const Dropdown = styled.div`
  background: linear-gradient(135deg, rgba(34,193,195,1) 0%,     rgba(253,187,45,1) 100%);
  color: #00ffb9;
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #00ffb9;
  border-top: 1px solid #00ffb9;
  p {
    font-size: 1rem;
  }
`;

function HelpPage() {
  const navigate = useNavigate();
  const[search] = useSearchParams();
  const id = search.get("id");
  const handleBack = async(e) => {
    navigate({
        pathname: "/Dashboard",
        search: createSearchParams({
            id: id
        }).toString()
    });
  }

const [clicked, setClicked] = useState(false)
const toggle = index => {
    if(clicked === index) {
        return setClicked(null)
    }
    setClicked(index)
};
  
  return (
    //div>
    <IconContext.Provider value={{size: '25px' }}>
       
    <div className="screen-Background">
      <div className="screen-Container">
        <div className="screen-Content">
            <h1>Find Your Issue</h1>
        <AccordionSection>
            
            <Container>
                {HelpData.map((item, index) => {
                return (
                <>
                    <Wrap onClick={() => toggle(index)} key={index}>
                    <h1>{item.question}</h1>
                    <span>{clicked === index ? <FiMinus /> : <FiPlus />}</span>
                    </Wrap>
                    {clicked === index ? (
                    <Dropdown>
                        <p>{item.answer}</p>
                    </Dropdown>
                    ) : null}
                </>
                );
            })}
            </Container>
            
        </AccordionSection>
        </div>
        <button className="btn-help-02" onClick={handleBack} >back</button>
      </div>
      </div>
      
      </IconContext.Provider>
  );
    
}
export default HelpPage;