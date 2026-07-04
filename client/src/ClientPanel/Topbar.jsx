import React, { useState } from "react";
import { createLead } from "../redux/api";
import { useDispatch } from "react-redux";
import { getLeadByPhone } from "../redux/action/lead";
import { 
  FormControl, 
  Input, 
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField, 
  Tooltip 
} from "@mui/material";
import { PiArchive, PiMagnifyingGlass } from "react-icons/pi";

const Topbar = () => {

  ////////////////////////////////////////// VARIABLES //////////////////////////////////////
  const title = "My Leads";
  ////////////////////////////////////////// STATES //////////////////////////////////////
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  ////////////////////////////////////////// USE EFFECTS //////////////////////////////////

  ////////////////////////////////////////// FUNCTIONS //////////////////////////////////////
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setForm({ name: "", email: "", phone: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};

    if (!form.name) tempErrors.name = "Name is required";
    if (!form.email) tempErrors.email = "Email is required";
    if (!form.phone) tempErrors.phone = "Phone is required";

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

const handleSubmit = async () => {
  if (!validate()) return;

  try {
    const res = await createLead({
      clientName: form.name,
      clientPhone: form.phone,
      city: "",
      priority: "moderate",
      status: "new",
      source: "directCall",
      description: "",
      count: 1,
    });

    console.log("Lead Created:", res.data);
    dispatch(getLeadByPhone(form.phone));
    handleClose();

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
  }
};

  return (
    <div className="flex flex-col tracking-wide pb-8 font-primary">
      <div className="flex items-center justify-between gap-2 md:mt-0 mt-4 w-full ">
        <h1 className="text-3xl  text-primary-blue font-semibold">{title}</h1>

        <div className="bg-[#ebf2f5] hover:bg-[#dfe6e8] p-1 pl-2 pr-2 rounded-md w-48">
          <FormControl>
            <Input
              name="search"
              placeholder="Search Leads"
              startAdornment={
                <InputAdornment position="start">
                  <PiMagnifyingGlass className="text-[25px]" />
                </InputAdornment>
              }
            />
          </FormControl>
        </div>

        {/* ADD CLIENT BUTTON */}
        <Button variant="contained" onClick={handleOpen}>
           + Add Client
        </Button>
      </div>
      {/* MODAL */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Client</DialogTitle>

        <DialogContent className="flex flex-col gap-4 mt-2">

          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />

          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
          />
          

        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Topbar;
