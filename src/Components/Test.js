import React, { Component, useEffect } from 'react'
import QrScanner from 'qr-scanner';


function Test(props) {
    useEffect(() => {
        if (true) {
          this.videoElem = document.getElementById('video').value;
        }
      }, ['hello'])

      console.log(this.videoElem)

    return (
        <div>
            <input
                type="text" />
            <video playsInLine id='video'></video>
            <input
                type="button"
                value="Focus the text input"

            />
        </div>
    )

}

export default Test;