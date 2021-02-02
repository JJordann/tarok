import React, { useState, useEffect } from "react"
import getSocket from './global'

const Contracts = ({ playable }) => {

    const socket = getSocket()

    let availableContracts = [
        "Ena", 
        "Dva",
        "Solo Brez",
        "Solo Ena",
        "Solo Dve", 
        "Solo Tri",
        "Pikolo", 
        "Berac",
        "Odprti Berac",
        "Valat",
        "Barvni Valat",
        "naprej"
    ]

    const handleContract = contract => {
        socket.emit("contract", contract)
        console.log(contract)
    }
    
    let Items = playable.map( c => 
        <div>
            <button onClick={() => handleContract(c)}>{c}</button>
            <br />
        </div>
    )


    return (
        <div>
            { Items }
        </div>
    )
}


export default Contracts