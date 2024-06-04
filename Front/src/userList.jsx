import React from "react";

const userList=[
    {
        name : "백씨",
        id : "test@example.com",
        password:"test1234@@",
    },  
]
export const addUser = (name, id, password) => {
    userList.push({ name, id, password });
    alert(`${userList.name}`);
};
export default userList;
