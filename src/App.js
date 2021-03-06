import React,{Component} from 'react';
import axios from 'axios';
import './App.css';
import {Modal,ModalBody,ModalHeader,Input,Col} from 'reactstrap';
import {ToastContainer,toast} from 'react-toastify';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
class App extends Component {
  constructor(props){
    super(props);
    this.state={
      modalOpen:false,
        items:[]
    }
    this.toggleModal=this.toggleModal.bind(this);
  }
  toggleModal=()=>{
    this.setState({
      modalOpen:!this.state.modalOpen
    })
  }
  downloader=()=>{
    axios({
      url:'http://room4010-bulk-insert.herokuapp.com/api/v1/user-profiles/sample',
      method:'GET',
      responseType:"blob",
    }).then((response)=>{
      const url=window.URL.createObjectURL(new Blob([response.data]));
      const link=document.createElement('a');
      link.href=url;
      link.setAttribute('download','file.xlsx');
      document.body.appendChild(link);
      link.click();
    });
    this.setState({
      modalOpen:!this.state.modalOpen
    })
  }
  fileChanger=async (e)=>{
    const files=e.target.files[0];
      this.setState({
        items:files
      })
  }
  fileUploader=()=>{
    const fileY=this.state.items;
    let data=new FormData();
    data.append('_file',fileY);
    this.setState({
      modalOpen:!this.state.modalOpen
    })
    fetch('//room4010-bulk-insert.herokuapp.com/api/v1/user-profiles/create-many',{
      method:'POST',
      body:data,
    })
    .then(res=>res.json())
    .then((res)=>
    {
      //Try one(1) reading the excel sheet directly
      // const promise=new Promise((resolve,reject)=>{
      //   const fileReaders=new FileReader();
      //   fileReaders.readAsArrayBuffer(fileY)
      //   fileReaders.onload=(e)=>{
      //     const bufferArray=e.target.result;
      //     const workbook=XLSX.read(bufferArray,{
      //       type:'buffer'
      //     });
      //     const workSheetName=workbook.SheetNames[0];
      //     const workSheet=workbook.Sheets[workSheetName];
      //     const data=XLSX.utils.sheet_to_json(workSheet);
      //     resolve(data);
      //   }
      //   fileReaders.onerror=((error)=>{
      //     reject(error);
      //   });
      // })
      // promise.then((data)=>{
      //   this.setState({
      //     items:data
      //   })
      // })
      
      //Try (2) reading the user profiles from the data objects from the request made
        const eachProfile=res.data.notCreated;
        this.setState({
          items:eachProfile
        })
      const successData=res.success;
      const datas=res
      console.log(datas)
      if(successData===false){
        toast(res.statusCode)
        toast(res.message,{
          className:"error-toast",
          type:'error',
          draggable:true,
          position:toast.POSITION.TOP_RIGHT
        })
      }
      else{
        toast(res.message,{
          className:"custom-toast",
          draggable:true,
          type:'success',
          position:toast.POSITION.TOP_RIGHT
        })
      }
    })
  }
  convertFile=(file)=>{
    return new Promise((resolve,reject)=>{
      const fileReaders=new FileReader();
      fileReaders.readAsArrayBuffer(file)
      fileReaders.onload=(e)=>{
        const bufferArray=e.target.result;
        const workbook=XLSX.read(bufferArray,{
          type:'buffer'
        });
        const workSheetName=workbook.SheetNames[0];
        const workSheet=workbook.Sheets[workSheetName];
        const data=XLSX.utils.sheet_to_json(workSheet);
        resolve(data);
      }
      fileReaders.onerror=((error)=>{
        reject(error);
      });
    })
  }

  render(){
    const {items,loading}=this.state
    return (
      <div className="app">
        <ToastContainer draggable={false} autoClose={3000}/>
          <div className="container">
            <div className="row justify-content-md-center align-items-center">
              <div className="col-md-auto col-sm-3 col-4">
                <p style={{fontSize:'17px',fontWeight:'700'}}>STUDENTS</p>
              </div>
                <div className="button col-md-2 col-sm-4 col-5 ml-auto">
                  <button onClick={this.toggleModal}> Batch Download</button>
                </div>
                <div className="col-md-8 col-sm-12">
                  <Col className="search">
                      <i className="fa fa-search"></i><Input type="text" name="names" id="names" placeholder="Search for students"/>
                  </Col>
                </div>
            </div>
            {
              items.length > 0 ? (
                <div>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email Address</th>
                        <th>Telephone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.items.map(item=>{
                          return(
                            <tr key={item.email}>
                              <td>{item.first_name}</td>
                              <td>{item.last_name}</td>
                              <td>{item.email}</td>
                              <td>{item.phone_number}</td>
                            </tr>
                          )
                        }
                        )
                        }
                    </tbody>
                  </table>
                </div>
                </div>
              )
              :
              (
                <p style={{fontSize:'17px',fontWeight:'600'}}>No data imported</p>
              )
            }
          </div>
          <Modal isOpen={this.state.modalOpen} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>
              Students
            </ModalHeader>
            <ModalBody className="modal-body">
              <div className="container">
                <div className="row align-items-center">
                  <button name="download" id="download" onClick={this.downloader}>Downloader</button>
                  <input type="file" name="_file" id="_file" onChange={this.fileChanger} onClick={this.fileExcelReader}/>
                  <button name="upload" id="upload" onClick={this.fileUploader}>Upload</button>
                </div>
              </div>
            </ModalBody>
          </Modal>
      </div>
    );
  }
}

export default App;
