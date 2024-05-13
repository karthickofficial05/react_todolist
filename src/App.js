import Content from "./Content";
import Footer from "./Footer";
import Header from "./Header";
import React,{ useEffect, useState , }from 'react'
import AddItem from "./AddItem";
import SearchItem from "./SearchItem";
import apiRequest from "./apiRequest";


function App() {
  const API_URL ="http://localhost:3500/items"

  const [items, setItems]= useState([]);

  const[newItem , setNewItem ] = useState('') // this code is used for received the variable 
  
  const[search , setSearch] =useState ('')

  const[fetchError , setFetchError ] =useState(null)

  const[isLoading , setIsLoading]= useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try{
            const response = await fetch(API_URL);
            if(!response.ok) throw Error("Data not received");
            // console.log(response)
            const listItems = await response.json();
            setItems(listItems);  
            setFetchError(null)        
      }catch (err){
        console.log(err.message);
        setFetchError(err.message);
      }finally{
        setIsLoading(false)
      }
    }
    setTimeout(() => {  (async () => await fetchItems())()
      
    }, 1000);
  }, []);
  
  
  
  const addItem = async (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;

        const addNewItem = {id ,checked:false, item}
        const listItems = [...items, addNewItem]
        //namba ezluthuna array vanthu setItem la store pannikirom
        setItems(listItems)
        
        const postOptions= {
          method: 'POST',
          Headers: {
            'Content-Type':'application/json'
          },
          body:JSON.stringify(addNewItem)
        }
        const result = await apiRequest(API_URL,postOptions);
        if(result) setFetchError(result)
  }
  

  const handleCheckboxChange = async(id) => {
         const listItem=items.map((item )=> 
         item.id === id ? { ...item, checked: !item.checked } : item)
         setItems(listItem)


         const myItem = listItem.filter((item)=>item.id===id)
         const updateOptions= {
          method: 'PATCH',
          Headers: {
            'Content-Type':'application/json'
          },
          body:JSON.stringify({checked:myItem[0].checked})
        }
        const requrl = `${API_URL}/${id}`
        const result = await apiRequest(requrl,updateOptions);
        if(result) setFetchError(result)
  };
 

  const deleteBox =async (id) =>{
        const listItem =items.filter((item)=>
        item.id !== id)
        setItems(listItem)

        const deleteOptions ={method :'DELETE'}

        const requrl = `${API_URL}/${id}`
        const result = await apiRequest(requrl,deleteOptions);
        if(result) setFetchError(result)
        
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    if(!newItem) return;
    console.log(newItem)//once newitem is executed to add other new item is setItems
    addItem(newItem)   // addItem function nambo call panni new item kulla anupurom
    setNewItem('') // set newItem add pannala antha value  angaiyae irukum
  } 
  
  
  return (
    <div className="App">
      
      <Header 
        title="To Do List"
      />
      <AddItem 
      newItem ={newItem}
      setNewItem = {setNewItem}
      handleSubmit={handleSubmit}
       
      />

      <SearchItem 
        search ={search}
        setSearch ={setSearch}     
      />

      <main>
      {isLoading && <p> Loading items... </p>}
      {fetchError &&  <p> {`Error: ${fetchError}`} </p>}

      {!isLoading && !fetchError &&<Content
          items= {items.filter(item =>(item.item).toLowerCase().includes(search.toLowerCase()))  }
          handleCheckboxChange ={handleCheckboxChange}
          deleteBox = {deleteBox}
        />}
      </main>

      <Footer 
        length= {items.length}
      />
      
       </div>
  );
}

export default App;
