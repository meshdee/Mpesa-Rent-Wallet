// ===========================================
// M-PESA Rent Wallet
// Unit Module
// Version 11.4 Enterprise
// ===========================================

"use strict";

console.log("===========================================");
console.log("M-PESA Rent Wallet");
console.log("Unit Module Version 11.4 Enterprise");
console.log("===========================================");

// ===========================================
// Form Elements
// ===========================================

const createUnitBtn =
    document.getElementById("createUnitBtn");

const unitProperty =
    document.getElementById("unitProperty");

const unitNumber =
    document.getElementById("unitNumber");

const bedrooms =
    document.getElementById("bedrooms");

const unitRent =
    document.getElementById("unitRent");

// ===========================================
// Table
// ===========================================

const unitsTableBody =
    document.getElementById("unitsTableBody");

// ===========================================
// Current Landlord
// ===========================================

function getLandlordId() {

    const landlordId =
        localStorage.getItem(STORAGE.LANDLORD_ID);

    console.log(
        "Current Landlord ID:",
        landlordId
    );

    return landlordId;

}

// ===========================================
// Load Properties
// ===========================================

async function loadProperties() {

    console.log("-------------------------------------------");
    console.log("Loading landlord properties...");
    console.log("-------------------------------------------");

    if (!unitProperty) {

        console.warn(
            "unitProperty element not found."
        );

        return;

    }

    const landlordId =
        getLandlordId();

    if (!landlordId) {

        console.warn(
            "No landlord ID found."
        );

        unitProperty.innerHTML = `
            <option value="">
                Register as landlord first
            </option>
        `;

        return;

    }

    try {

        const response = await fetch(

            `/api/properties/${landlordId}`

        );

        console.log(
            "Properties HTTP Status:",
            response.status
        );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }

        const result =
            await response.json();

        console.log(
            "Properties API Result:",
            result
        );

        const properties =
            result.properties || [];

        unitProperty.innerHTML = `
            <option value="">
                Select Property
            </option>
        `;

        if (properties.length === 0) {

            unitProperty.innerHTML = `
                <option value="">
                    No properties registered
                </option>
            `;

            console.log(
                "No properties found for this landlord."
            );

            return;

        }

        properties.forEach(property => {

            unitProperty.innerHTML += `

                <option value="${property.id}">

                    ${property.propertyName}

                </option>

            `;

        });

        console.log(
            "Properties loaded:",
            properties.length
        );

    }

    catch (error) {

        console.error(
            "Load Properties Error:",
            error
        );

        unitProperty.innerHTML = `
            <option value="">
                Unable to load properties
            </option>
        `;

    }

}

// ===========================================
// Load Units
// ===========================================

async function loadUnits() {

    console.log("-------------------------------------------");
    console.log("Loading landlord units...");
    console.log("-------------------------------------------");

    if (!unitsTableBody) {

        console.warn(
            "unitsTableBody element not found."
        );

        return;

    }

    const landlordId =
        getLandlordId();

    if (!landlordId) {

        unitsTableBody.innerHTML = `

            <tr>

                <td colspan="5" class="empty-state">

                    Register as a landlord first.

                </td>

            </tr>

        `;

        return;

    }

    try {

        const response = await fetch(

            `/api/units/${landlordId}`

        );

        console.log(
            "Units HTTP Status:",
            response.status
        );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }

        const result =
            await response.json();

        console.log(
            "Units API Result:",
            result
        );

        const units =
            result.units || [];

        console.log(
            "Units found:",
            units.length
        );

        unitsTableBody.innerHTML = "";

        if (units.length === 0) {

            unitsTableBody.innerHTML = `

                <tr>

                    <td colspan="5" class="empty-state">

                        No units created for this landlord.

                    </td>

                </tr>

            `;

            return;

        }

    units.forEach(unit => {

    console.log(
        "Rendering Unit:",
        unit
    );

    unitsTableBody.innerHTML += `

        <tr class="unit-row">

            <td data-label="Property">

                <span class="unit-property">
                    ${unit.propertyName || "-"}
                </span>

            </td>


            <td data-label="Unit">

                <strong class="unit-number">
                    ${unit.unitNumber || "-"}
                </strong>

            </td>


            <td data-label="Bedrooms">

                <span class="unit-bedrooms">
                    ${unit.bedrooms ?? "-"}
                </span>

            </td>


            <td data-label="Rent">

                <span class="unit-rent">
                    KES ${Number(
                        unit.monthlyRent || 0
                    ).toLocaleString()}
                </span>

            </td>


            <td data-label="Status">

                <span class="unit-status">
                    ${unit.status || "VACANT"}
                </span>

            </td>

        </tr>

    `;

    });

        console.log(
            "✅ Units table rendered successfully."
        );

    }

    catch (error) {

        console.error(
            "Load Units Error:",
            error
        );

        unitsTableBody.innerHTML = `

            <tr>

                <td colspan="5" class="empty-state">

                    Unable to load units.

                </td>

            </tr>

        `;

    }

}

// ===========================================
// Create Unit
// ===========================================

if (createUnitBtn) {

    createUnitBtn.addEventListener(

        "click",

        async () => {

            console.log("-------------------------------------------");
            console.log("Creating Unit...");
            console.log("-------------------------------------------");

            const landlordId =
                getLandlordId();

            if (!landlordId) {

                alert(
                    "Please register as a landlord first."
                );

                return;

            }

            if (

                !unitProperty ||

                unitProperty.value === ""

            ) {

                alert(
                    "Please select a property."
                );

                return;

            }

            if (

                !unitNumber ||

                unitNumber.value.trim() === ""

            ) {

                alert(
                    "Please enter a unit number."
                );

                return;

            }

            if (

                !unitRent ||

                unitRent.value === ""

            ) {

                alert(
                    "Please enter the monthly rent."
                );

                return;

            }

            const data = {

                landlordId:

                    landlordId,

                propertyId:

                    unitProperty.value,

                unitNumber:

                    unitNumber.value.trim(),

                bedrooms:

                    Number(
                        bedrooms.value || 1
                    ),

                monthlyRent:

                    Number(
                        unitRent.value
                    )

            };

            console.log(
                "Unit Registration Data:",
                data
            );

            try {

                const response = await fetch(

                    "/api/units",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(data)

                    }

                );

                console.log(
                    "Create Unit HTTP Status:",
                    response.status
                );

                const result =
                    await response.json();

                console.log(
                    "Create Unit API Result:",
                    result
                );

                if (!response.ok) {

                    alert(
                        result.message ||
                        "Unable to create unit."
                    );

                    return;

                }

                alert(
                    result.message ||
                    "Unit created successfully."
                );

                // ===================================
                // Clear Form
                // ===================================

                unitProperty.selectedIndex = 0;

                unitNumber.value = "";

                bedrooms.value = 1;

                unitRent.value = "";

                // ===================================
                // Reload Units
                // ===================================

                await loadUnits();

            }

            catch (error) {

                console.error(
                    "Create Unit Error:",
                    error
                );

                alert(
                    "Unable to create unit."
                );

            }

        }

    );

}

// ===========================================
// Initialize
// ===========================================

async function initializeUnitPage() {

    console.log("===========================================");
    console.log("Initializing Unit Page...");
    console.log("===========================================");

    await loadProperties();

    await loadUnits();

    console.log(
        "✅ Unit Page Initialized"
    );

}

// ===========================================
// Start
// ===========================================

initializeUnitPage();

console.log(
    "✅ Unit Module Version 11.4 Enterprise Loaded"
);