import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'

const localizer = dayjsLocalizer(dayjs)

import 'react-big-calendar/lib/css/react-big-calendar.css';

import 'dayjs/locale/es'

dayjs.locale('es')



import { firestoreDB, storageDocs } from './firebase/firebaseConfig';

import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  where,
  query,
} from 'firebase/firestore';



 const msecToDateNumbers =(milliseconds)=>{ // '16/8/2024, 12:00:00 a.m.'
      return new Date(milliseconds).toLocaleString()
  }







function App() {


  const [items, setItems] = useState([]);

  const itemCollection = query(
      collection(firestoreDB, 'RealControlCustomers'),
  )

  const [toggle, setToggle] = useState(true)

  useEffect(() => {

      getDocs(itemCollection).then((resp) => {

          if (resp.size === 0) {
              console.log('No results!');
          }

          const documents = resp.docs.map((doc) => (
              { id: doc.id, ...doc.data() }
          ))

          setItems(documents);

      }).catch((err) => {
          console.log('Error searching items', err)
      })

  }, [toggle])




  let serviciosArr=[]

  


  items.forEach((el,i)=>{

    if(el.proximoServicio!==undefined){

        let day = new Date(el.proximoServicio).toLocaleString().split('/')[0]
        let month = new Date(el.proximoServicio).toLocaleString().split('/')[1]
        let year = new Date(el.proximoServicio).toLocaleString().split('/')[2].slice(0, 4)
    
        let time = new Date(el.proximoServicio).toLocaleString().slice(12,19)  
        let a = year + '-' + month +'-'+ day + 'T' + time 


        serviciosArr.push({title: el.nombreCliente, start:a, end:a})

    }

  })

  console.log(serviciosArr)



  const[taskState, setTaskState]=useState({
    comentarios:"",
    direccionCliente:"",
    correoCliente:"",
    fechaMeta:"",
    nombreCliente:"",
    servicioRealizado:"",
    tipoDeServicio:"",
    telefonoCliente:""
  })


  const {
    comentarios,
    direccionCliente,
    correoCliente,
    fechaMeta,
    nombreCliente,
    servicioRealizado,
    tipoDeServicio,
    telefonoCliente
  } = taskState


  const handlerTaskState=({target})=>{
      const {name, value} = target
      setTaskState({...taskState, [name]:value})
  }



  const postCollection = collection(firestoreDB, 'RealControlCustomers');

  const guardar =()=>{

      if (comentarios.trim() === '' ||
          direccionCliente.trim() === '' ||
          telefonoCliente.trim() === '' ||
          correoCliente.trim() === '' ||
          fechaMeta.trim() === '' ||
          nombreCliente.trim() === '' ||
          servicioRealizado.trim() === '' ||
          tipoDeServicio.trim() === '' ){
              alert('Algun Campo esta Vacio')
              return
          }


      if (confirm("Gaurdar Cliente")) {



          taskState.dataArr = [{servicioRealizado,tipoDeServicio,lastTime:Date.now(),comentarios,fechaMeta}]

          delete taskState.servicioRealizado
          delete taskState.tipoDeServicio
          delete taskState.comentarios
          delete taskState.fechaMeta

          addDoc(postCollection, taskState)
          setTaskState({
              comentarios:"",
              direccionCliente:"",
              telefonoCliente:"",
              correoCliente:"",
              fechaMeta:"",
              nombreCliente:"",
              servicioRealizado:"",
              tipoDeServicio:""
          })

          setTimeout(()=>{
            window.location.reload()
          },600)
          
      }

  }






  const [updateMode, setUpdateMode]=useState(false)

  const [newObj, setNewObj]=useState({
    comentarios:"",
    fechaMeta:"",
    servicioRealizado:"",
    tipoDeServicio:""
  })



  const handlerUpdateMode=({target})=>{
      const {name, value} = target
      setNewObj({...newObj, [name]:value})
  }

  const [saveObj, setSaveObj]=useState()
  const [saveID, setSaveID]=useState()

 


  const updateById = async (id, obj) => {

      setSaveObj(obj)
      setSaveID(id)

      if(updateMode === false){
          setUpdateMode(true)
          return
      }

      newObj.lastTime = Date.now()


      saveObj.dataArr.push(newObj)


      if (confirm("Añadir nueva info a Cliente")) {

          delete saveObj.id

          const aDoc = doc(firestoreDB, 'RealControlCustomers', saveID)

          try {
              await updateDoc(aDoc, saveObj);
          } catch (error) {
              console.error(error);
          }

          setUpdateMode(false)
          setToggle(!toggle)

      }

  }



    // const [clienteNameFinder, setClienteNameFinder]=useState()

    // const handlerFinder =(e)=>{
    //     if(e.target.value.length > 3){
    //         setClienteNameFinder(e.target.value)
    //     }
    // }



    // const [show, setShow] = useState(false);

    // const handleClose = () => {
    //   setUpdateMode(false)
    //   setShow(false)
    // }

    // const handleShow = () => setShow(true);

  let myEventsList =[{
      start:dayjs('2024-10-4T12:00:00').toDate(),
      end:dayjs('2024-10-4T12:00:00').toDate(),
      title:'Primer evento',
      data:{
        d:'10'
      }
  },{
      start:dayjs('2024-10-5T7:00:00').toDate(),
      end:dayjs('2024-10-5T8:00:00').toDate(),
      title:'Segundo evento',
      data:{
        d:'20'
      }
  }]

console.log(myEventsList)

  const messages = {
    allDay: "Todo el día",
    previous: "Anterior",
    next: "Siguiente",
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "Sin eventos"
};


const components={
  event: e =>{
    // console.log(e)
    return<div className='events'>
        <span>{e.title}</span>
    </div>
  }
}


const [selected, setSelected] = useState();

const handleSelected = (event) => {
    setSelected(event.data.d);
    console.info(event.title);
};


  return (
    <>

  

        <h1>Calendario</h1>


        <div  style={{ height: '90vh', width:'90vw', marginLeft:'5vw'}}>
            <Calendar
                localizer={localizer}
                events={myEventsList}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleSelected}
               
                views={['month','week','day','agenda']}
                toolbar={true}
                messages={messages}
                components={components}
            />
        </div>
       


    </>
  )
}

export default App
  