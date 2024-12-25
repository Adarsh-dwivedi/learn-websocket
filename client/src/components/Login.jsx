export default function Login({onChange, onClick}){
    return (
        <>
            <div>Please Enter your name</div>
            <input onChange={onChange} type="text" placeholder="username"/>
            <button onClick={onClick}>Submit</button>
        </>
    )
}