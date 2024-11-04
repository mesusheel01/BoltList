import React, {  useEffect } from 'react';

function DynamicTextComponent({text,setText,username}) {

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setText(`Good morning ${!username?"":`${username}`}! Start tracking your activity...`);
    } else if (hour < 18) {
      setText(`Good afternoon ${!username?"":`${username}`}! Keep up with your activities...`);
    } else {
      setText(`Good evening ${!username?"":`${username}`}! Review your activities for the day...`);
    }
  }, []);

  return <div>
    <p>{text}</p>
  </div>;
}

export default DynamicTextComponent;
