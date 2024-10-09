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



    const [show, setShow] = useState(false);

    const handleClose = () => {
      setShow(false)
    }

    const handleShow = () => setShow(true);



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

        // let day = new Date(el.proximoServicio).toLocaleString().split('/')[0]
        // let month = new Date(el.proximoServicio).toLocaleString().split('/')[1]
        // let year = new Date(el.proximoServicio).toLocaleString().split('/')[2].slice(0, 4)
    
        // let time = new Date(el.proximoServicio).toLocaleString().slice(12,19)  
        // let a = year + '-' + month +'-'+ day + 'T' + time 


        serviciosArr.push({title: el.nombreCliente, start:new Date(el.proximoServicio), end:new Date(el.proximoServicio)})

    }

  })

  console.log(serviciosArr)





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
    return<div className='events' onClick={()=>{
                                                  handleShow()
                                                  localStorage.customerName=e.title
                                                }}>
        <span>{e.title.slice(0,12)}</span>
    </div>
  }
}


const [selected, setSelected] = useState();

const handleSelected = (event) => {
    setSelected(event.title);
    console.info(event.title);
};


  return (
    <>

  

        <h1>Calendario</h1>


        <div  style={{ height: '90vh', width:'90vw', marginLeft:'5vw'}}>
            <Calendar
                localizer={localizer}
                events={serviciosArr}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleSelected}
               
                views={['month','week','day','agenda']}
                toolbar={true}
                messages={messages}
                components={components}
            />
        </div>








        <Modal show={show} onHide={handleClose} centered>

        <Modal.Header closeButton>
          <Modal.Title>Cliente: </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            {localStorage.customerName}
        </Modal.Body>

    
      </Modal>
       


    </>
  )
}

export default App
  