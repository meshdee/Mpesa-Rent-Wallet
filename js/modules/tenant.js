// ===========================================
// M-PESA Rent Wallet
// Tenant Module (Version 9.4)
// ===========================================

// Buttons
const registerTenantBtn =
document.getElementById("registerTenantBtn");

// Form Fields
const tenantName =
document.getElementById("tenantName");

const tenantId =
document.getElementById("tenantId");

const tenantPhone =
document.getElementById("tenantPhone");

const tenantEmail =
document.getElementById("tenantEmail");

const tenantProperty =
document.getElementById("tenantProperty");

const tenantUnit =
document.getElementById("tenantUnit");

const tenantRent =
document.getElementById("tenantRent");

// Table
const tenantTableBody =
document.getElementById("tenantTableBody");

// ===========================================
// Load Properties
// ===========================================

async function loadProperties() {

    try {

        const response = await fetch("/api/properties");

        const properties = await response.json();

        tenantProperty.innerHTML =
        `<option value="">Select Property</option>`;

        properties.forEach(property => {

            tenantProperty.innerHTML += `

                <option value="${property.id}">

                    ${property.propertyName}

                </option>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

}

// ===========================================
// Load Available Units
// ===========================================

async function loadUnits(propertyId){

    tenantUnit.innerHTML =
    `<option value="">Select Unit</option>`;

    if(!propertyId){

        return;

    }

    try{

        const response =
        await fetch(`/api/units/available/${propertyId}`);

        const units =
        await response.json();

        units.forEach(unit=>{

            tenantUnit.innerHTML += `

                <option value="${unit.id}">

                    ${unit.unitNumber}

                </option>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

}

// ===========================================
// Load Tenants
// ===========================================

async function loadTenants(){

    try{

        const response =
        await fetch("/api/tenants");

        const tenants =
        await response.json();

        tenantTableBody.innerHTML="";

        if(tenants.length===0){

            tenantTableBody.innerHTML=`

            <tr>

                <td colspan="5">

                    No tenants registered.

                </td>

            </tr>

            `;

            return;

        }

        tenants.forEach(tenant=>{

            tenantTableBody.innerHTML+=`

                <tr>

                    <td>${tenant.fullName}</td>

                    <td>${tenant.phone}</td>

                    <td>${tenant.propertyName}</td>

                    <td>${tenant.unitNumber}</td>

                    <td>KES ${Number(tenant.monthlyRent).toLocaleString()}</td>

                </tr>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

}

// ===========================================
// Property Changed
// ===========================================

tenantProperty.addEventListener(

    "change",

    ()=>{

        loadUnits(

            tenantProperty.value

        );

    }

);

// ===========================================
// Register Tenant
// ===========================================

registerTenantBtn.addEventListener(

"click",

async()=>{

    if(

        tenantName.value==="" ||

        tenantProperty.value==="" ||

        tenantUnit.value===""

    ){

        alert("Please complete all required fields.");

        return;

    }

    const data={

        landlordId:"",

        propertyId:tenantProperty.value,

        unitId:tenantUnit.value,

        fullName:tenantName.value,

        nationalId:tenantId.value,

        phone:tenantPhone.value,

        email:tenantEmail.value,

        monthlyRent:Number(tenantRent.value)

    };

    try{

        const response=

        await fetch("/api/tenants",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(data)

        });

        const result=

        await response.json();

        alert(result.message);

        tenantName.value="";

        tenantId.value="";

        tenantPhone.value="";

        tenantEmail.value="";

        tenantProperty.selectedIndex=0;

        tenantUnit.innerHTML=
        `<option value="">Select Unit</option>`;

        tenantRent.value="";

        loadTenants();

    }

    catch(error){

        console.error(error);

        alert("Unable to register tenant.");

    }

}

);

// ===========================================
// Initialize
// ===========================================

loadProperties();

loadTenants();