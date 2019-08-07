import React, { Component } from "react";
import { TextInput, Row, Col, Button } from "react-materialize";
import axios from "axios";
import { ListingAPI } from '../../utils/API'

class ListForm extends Component {


state = {
    vin: "",
    price:"",
    make:"",
    model:"",
    year:"",
    file:"",
    UserId: 1,
    listings: [],
    currentListingId: ""
}

componentDidMount() {
    //Testing CRUD Routes
    // let id = 123;
    // Test.postQuery();
    // Test.getResponse();
    // Test.putQuery(id);
    // Test.deleteQuery(id);
    // UserAPI.getAllUsers();
    // this.getAllListing();


  }


searchAction() {
    console.log("Submit")

    axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${this.state.vin}*BA?format=json`)
        .then(response => {
            var vin = response.data.Results[0];
            if(!vin.Model){
                alert ("You have entered an invalid VIN")
            }
            else {
            console.log("response data", vin)
            console.log("all response data", response.data.Results)
            console.log("year",vin.ModelYear);
            console.log("model", vin.Model);
            console.log("make", vin.Make);
            this.setState({make:vin.Make, model:vin.Model, year:vin.ModelYear})
            }
        })


    setTimeout(this.saveListing, 3000);



}


saveListing = () =>
{
    let price = this.state.price;
    let make = this.state.make;
    let model = this.state.model;
    let year = this.state.year;
    let UserId = this.state.UserId;
    let vin = this.state.vin;

    let image = this.state.file;

     var listing =
            {
                price: price,
                make: make,
                model: model,
                year: year,
                UserId: UserId,
                vin: vin
            }
    console.log(listing);
    ListingAPI.postListing(listing).then(data =>
    {
        console.log("saved listing");
        console.log(data);


        //Get back lisitng id to upload photo
        console.log("saved listing id");
        console.log(data.data.id);
        var templistingid = data.data.id;
        this.setState({currentListingId: templistingid});
    });

    setTimeout(this.createListingUrl, 3000);
    // setTimeout(this.getAllListing, 5000);

    // var ma = "TESLA";
    // var mo = "Model S";
    // var ye = "2018";
    // setTimeout(this.getListingByVehicle(ma, mo, ye), 5000);

    var user = this.state.UserId;
    setTimeout(this.getListingByUser(user), 5000);
}




// //get all listing
// getAllListing = () =>
// {
//     ListingAPI.getAllListing().then(function(data){
//       console.log("all listings databack");
//       console.log(data);
//     });
// }


// getListingByVehicle = (make, model, year) =>
// {   
//     // var make = "TESLA";
//     // var model = "Model S";
//     // var year = "2018";


//     ListingAPI.getListingByVehicle(make, model, year).then(function(data){
//       console.log("all listings by vehicle databack");
//       console.log(data);
//   })

// }

getListingByUser = (UserId) =>
{
    ListingAPI.getListingByUser(UserId).then(function(data){
        console.log("Byuser data", data);
    });
        
 
}


createListingUrl = () =>
{
        var listing = new FormData();
        var name = this.state.vin;
        var image = this.state.file;
        var currentListingId = this.state.currentListingId;
        console.log(name);
        console.log(image);
        console.log(currentListingId);


        listing.append("name", name);
        listing.append("file", image);
        listing.append("currentListingId", currentListingId);

        ListingAPI.createListingUrl(listing);
}


editListing = () =>
{
    console.log("in editlisting");
     // let price = this.state.price;
     let price = 20;
     let id = 10
     var listing =
            {
                price: price,
            }
     ListingAPI.editListing(id, listing);
}




handleChange = event => {
    const { name, value } = event.target;
    this.setState({[name]: value});
}

handleImageChange = event => {
    this.setState({file:event.target.files[0]});
    var image = this.state.file;
    console.log(image);
}

validate = () => {
    var carId = this.state.vin;
    var file = this.state.file;
    var price = this.state.price;
    console.log("price", price)
    if (!carId || !file) {
        console.log("it works here")
        alert ("Please fill out required fields")
    }
}

render () {
    return (
        <Row className = "searchInput">
            <Col>
            <form onSubmit={e => {
                e.preventDefault();
                this.searchAction();
            }}>
                <Row style={{marginBottom: '0px'}}>
                <Col className="input-field">
                    <TextInput name="vin" value={this.state.vin} onChange={this.handleChange} type="text" label="Vin" />                    
                </Col>
                    <Col className="input-field">
                    <TextInput name="price" value={this.state.price} onChange={this.handleChange} type="number" label="Price" />                    
                </Col>
                <Col className="input-field">
                    <TextInput name="make" value={this.state.make} onChange={this.handleChange} type="text" label="Make"  disabled={true}/>                    
                </Col>
                <Col className="input-field">
                    <TextInput name="model" value={this.state.model} onChange={this.handleChange} type="text" label="Model" disabled={true} />                    
                </Col>
                <Col className="input-field">
                    <TextInput name="year" value={this.state.year} onChange={this.handleChange} type="text" label="Year" disabled={true} />                    
                </Col>
                </Row>
                 <div class="uk-margin">
                    <div uk-form-custom>
                        <input id="file-input" onChange={this.handleImageChange} type="file"/>
                    </div>
                </div>
                <Row>
                    <Button onClick={this.validate} type="submit" className="#37474f blue-grey darken-3" waves="light" style={{marginLeft: '22px'}}>Make Listing</Button>
                </Row>

            </form>
            </Col>
        </Row>
    )
}
}

export default ListForm;