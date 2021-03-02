import React,{Component} from 'react';
import axios from 'axios';
import './App.css';
import {Modal,ModalBody,ModalHeader,Input,Col} from 'reactstrap';
import {ToastContainer,toast,Zoom,Bounce} from 'react-toastify';
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
  fileChanger=(e)=>{
    const files=e.target.files[0];
      this.setState({
        items:files
      })
    // const promise=new Promise((resolve,reject)=>{
    //   const fileReaders=new FileReader();
    //   fileReaders.readAsArrayBuffer(files)
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
  }
  fileUploader=()=>{
    const fileY=this.state.items;
    let data=new FormData();
    data.append('_file',fileY);
    console.log(data);
    fetch('//room4010-bulk-insert.herokuapp.com/api/v1/user-profiles/create-many',{
      method:'POST',
      body:data,
    })
    .then(res=>res.json())
    .then((res)=>
    {
      const successData=res.ok;
      if(successData===false){
        toast(res.statusCode)
        toast(res.message,{
          className:"error-toast",
          draggable:true,
          position:toast.POSITION.TOP_RIGHT
        })
      }
      else{
          const promise=new Promise((resolve,reject)=>{
          const fileReaders=new FileReader();
          fileReaders.readAsArrayBuffer(fileY)
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
        promise.then((data)=>{
          this.setState({
            items:data
          })
          toast(res.message,{
            className:"custom-toast",
            draggable:true,
            position:toast.POSITION.TOP_RIGHT
          })
        })
      }
    })
    this.setState({
      modalOpen:!this.state.modalOpen
    })
  }

  render(){
    const {items}=this.state
    return (
      <div className="app justify-content-center">
        <ToastContainer draggable={false}/>
          <div className="container headers">
            <div className="row justify-content-center align-items-center">
              <p style={{fontSize:'17px',fontWeight:'700'}} className="col-md col-sm col">STUDENTS</p>
              <div className="button col-md col-sm col-auto">
                <button onClick={this.toggleModal}> Batch Download</button>
              </div>
              <div className="col-md-7 col-sm-6 col-12">
                <Col className="search">
                    <i className="fa fa-search"></i><Input type="text" name="names" id="names" placeholder="Search for students"/>
                </Col>
              </div>
            </div>
              {/* <table className="table table-fit">
                <thead>
                  <tr>
                    <th>FirstName</th>
                    <th>LastName</th>
                    <th>Email Address</th>
                    <th>Telephone</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    items.map(item=>{
                      <tr>
                        <td>{item.Gender}</td>
                      </tr>
                    })
                  }
                </tbody>
              </table> */}
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
