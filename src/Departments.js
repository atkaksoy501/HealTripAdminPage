import React, { useState, useEffect } from "react";
import { Grid, Paper, TextField, Button } from "@material-ui/core";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Swal from 'sweetalert2';

export const Departments = () => {
  const paperStyle = {
    padding: 20,
    height: "200px",
    width: 400,
    margin: "20px auto",
  };
  const btnstyle = { margin: "20px 0", backgroundColor: "#265867" };

  const [showPopup, setShowPopup] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    axios.get("https://healtrip.azurewebsites.net/department/getAll")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  };

  const handleSubmit = (e) => {
    const token = localStorage.getItem("token");
  
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    e.preventDefault();
  
    const departmentName = e.target.elements.departmentName.value;
  
    console.log("Department Name:", departmentName);
  
    axios
      .post("https://healtrip.azurewebsites.net/department/add", {
        departmentName,
      }, {headers})
      .then(() => {
        fetchDepartments();
        Swal.fire("Successfully!", "Department added successfully.", "success");
      })
      .catch((error) => {
        console.error("An error occurred while attempting to delete the section.", error);
        Swal.fire("Error!", "An error occurred while attempting to delete the section.", "error");
      });
  
    e.target.reset();
    setShowPopup(false);
  };  
  
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this department?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        axios
          .delete(`https://healtrip.azurewebsites.net/department/delete/${id}`, { headers })
          .then(() => {
            fetchDepartments();
            Swal.fire("Deleted!", "Deleted Successfully.", "success");
          })
          .catch((error) => {
            console.error("An error occurred while attempting to delete the section.", error);
            Swal.fire("An error occurred while attempting to delete the section.", error);
          });
      }
    });
  };
  
  const handleAddButtonClick = () => {
    setShowPopup(true);
    setDepartments([]);
  };

  return (
    <Grid>
      <Button
        style={{
          marginLeft: "65%",
          width: "155px",
          backgroundColor: "#265867",
          color: "#fff",
        }}
        onClick={handleAddButtonClick}
      >
        Add Department
      </Button>
      <div>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {departments.map((department) => (
            <li
              key={department.id}
              style={{
                marginTop: "50px",
                border: "1px solid #ccc",
                padding: "50px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width:"80%",
                marginLeft:"30px"
              }}
            >
              <span>{department.departmentName}</span>
              <div>
                <EditIcon style={{cursor: "pointer", color:"#265867", paddingRight:"10px"}} />
                <DeleteIcon style={{cursor: "pointer", color:"#d33"}} onClick={() => handleDelete(department.id)} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      {showPopup && (
        <div className="popup-login">
          <form onSubmit={handleSubmit}>
            <Paper elevation={10} style={paperStyle}>
              <Grid align="center">
                <h2 style={{ color: "#265867" }}>Department</h2>
              </Grid>
              <div style={{ marginTop: "10px" }}>
                <TextField
                  name="departmentName"
                  label="Department Name"
                  placeholder="Enter Department Name"
                  fullWidth
                  required
                  inputProps={{ style: { fontSize: 14, width: "90%" } }}
                />
              </div>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                style={btnstyle}
                fullWidth
              >
                Add
              </Button>
            </Paper>
          </form>
        </div>
      )}
    </Grid>
  );
};
