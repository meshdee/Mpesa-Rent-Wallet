// ===========================================
// M-PESA Rent Wallet
// Tenant Module
// Version 11.7 Enterprise
// ===========================================

"use strict";

console.log("===========================================");
console.log("M-PESA RENT WALLET");
console.log("TENANT MODULE VERSION 11.7");
console.log("===========================================");


// ===========================================
// Storage
// ===========================================

function getLandlordId() {

    if (
        typeof STORAGE === "undefined"
    ) {

        console.error(
            "STORAGE configuration is not loaded."
        );

        return null;

    }

    return localStorage.getItem(
        STORAGE.LANDLORD_ID
    );

}


// ===========================================
// HTML Elements
// ===========================================

const registerTenantBtn =
    document.getElementById(
        "registerTenantBtn"
    );

const tenantName =
    document.getElementById(
        "tenantName"
    );

const tenantId =
    document.getElementById(
        "tenantId"
    );

const tenantPhone =
    document.getElementById(
        "tenantPhone"
    );

const tenantEmail =
    document.getElementById(
        "tenantEmail"
    );

const tenantProperty =
    document.getElementById(
        "tenantProperty"
    );

const tenantUnit =
    document.getElementById(
        "tenantUnit"
    );

const tenantRent =
    document.getElementById(
        "tenantRent"
    );

const tenantTableBody =
    document.getElementById(
        "tenantTableBody"
    );

const tenantCount =
    document.getElementById(
        "tenantCount"
    );

const occupiedUnits =
    document.getElementById(
        "occupiedUnits"
    );

const tenantRevenue =
    document.getElementById(
        "tenantRevenue"
    );

const tenantCountBadge =
    document.getElementById(
        "tenantCountBadge"
    );


// ===========================================
// Load Properties
// ===========================================

async function loadProperties() {

    console.log("-------------------------------------------");
    console.log("LOADING LANDLORD PROPERTIES");
    console.log("-------------------------------------------");

    const landlordId =
        getLandlordId();

    if (!landlordId) {

        console.warn(
            "No landlord ID found."
        );

        return;

    }

    try {

        const response =
            await fetch(
                `/api/properties/${landlordId}`
            );


        console.log(
            "Properties HTTP Status:",
            response.status
        );


        const result =
            await response.json();


        console.log(
            "Properties API Result:",
            result
        );


        if (!response.ok || !result.success) {

            console.error(
                "Unable to load properties."
            );

            return;

        }


        const properties =
            result.properties || [];


        tenantProperty.innerHTML =
            `<option value="">
                Select Property
            </option>`;


        properties.forEach(
            property => {

                tenantProperty.innerHTML += `

                    <option value="${property.id}">

                        ${property.propertyName}

                    </option>

                `;

            }
        );


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

    }

}

// ===========================================
// Load Available Units
// ===========================================

async function loadAvailableUnits(propertyId) {

    console.log("-------------------------------------------");
    console.log("LOADING AVAILABLE UNITS");
    console.log("-------------------------------------------");


    // Reset dropdown

    tenantUnit.innerHTML = `
        <option value="">
            Select Unit
        </option>
    `;


    // No property selected

    if (!propertyId) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/units/available/${propertyId}`
            );


        console.log(
            "Available Units HTTP Status:",
            response.status
        );


        const result =
            await response.json();


        console.log(
            "Available Units API Result:",
            result
        );


        // Stop if API request failed

        if (!response.ok) {

            console.error(
                "Available Units API failed:",
                result
            );

            return;

        }


        // ===================================
        // Extract units from API response
        // ===================================

        const units =
            Array.isArray(result)
                ? result
                : Array.isArray(result.units)
                    ? result.units
                    : Array.isArray(result.data)
                        ? result.data
                        : Array.isArray(result.availableUnits)
                            ? result.availableUnits
                            : [];


        console.log(
            "Available Units Array:",
            units
        );


        console.log(
            "Available units loaded:",
            units.length
        );


        // ===================================
        // No available units
        // ===================================

        if (units.length === 0) {

            tenantUnit.innerHTML = `
                <option value="">
                    No available units
                </option>
            `;

            return;

        }


        // ===================================
        // Populate dropdown
        // ===================================

        units.forEach(unit => {

            const option =
                document.createElement("option");


            option.value =
                unit.id;


            option.textContent =
                unit.unitNumber ||
                unit.unit_name ||
                unit.name ||
                "Unit";


            tenantUnit.appendChild(option);

        });


        console.log(
            "✅ Available Unit dropdown populated successfully."
        );

    }


    catch (error) {

        console.error(
            "Load Available Units Error:",
            error
        );


        tenantUnit.innerHTML = `
            <option value="">
                Unable to load units
            </option>
        `;

    }

}

// ===========================================
// Property Changed
// ===========================================

if (tenantProperty) {

    tenantProperty.addEventListener(
        "change",
        () => {

            loadAvailableUnits(
                tenantProperty.value
            );

        }
    );

}


// ===========================================
// Load Tenants
// ===========================================

async function loadTenants() {

    console.log("-------------------------------------------");
    console.log("LOADING LANDLORD TENANTS");
    console.log("-------------------------------------------");


    const landlordId =
        getLandlordId();


    if (!landlordId) {

        console.warn(
            "No landlord ID found."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `/api/tenants/${landlordId}`
            );


        console.log(
            "Tenants HTTP Status:",
            response.status
        );


        const result =
            await response.json();


        console.log(
            "Tenants API Result:",
            result
        );


        if (!response.ok || !result.success) {

            console.error(
                "Unable to load tenants."
            );

            return;

        }


        const tenants =
            result.tenants || [];


        renderTenants(
            tenants
        );


        updateTenantStatistics(
            tenants
        );


        console.log(
            "Tenants found:",
            tenants.length
        );

    }

    catch (error) {

        console.error(
            "Load Tenants Error:",
            error
        );

    }

}


// ===========================================
// Render Tenants
// ===========================================

function renderTenants(
    tenants
) {

    if (!tenantTableBody) {

        return;

    }


    tenantTableBody.innerHTML = "";


    if (tenants.length === 0) {

        tenantTableBody.innerHTML = `

            <tr>

                <td colspan="6">

                    No tenants registered.

                </td>

            </tr>

        `;

        return;

    }


   tenants.forEach(
    tenant => {

        tenantTableBody.innerHTML += `

            <tr>

                <td>

                    ${escapeHtml(
                        tenant.fullName
                    )}

                </td>

                <td>

                    ${escapeHtml(
                        tenant.phone
                    )}

                </td>

                <td>

                    ${escapeHtml(
                        tenant.propertyName
                    )}

                </td>

                <td>

                    ${escapeHtml(
                        tenant.unitNumber
                    )}

                </td>

                <td>

                    KES ${Number(
                        tenant.monthlyRent || 0
                    ).toLocaleString()}

                </td>

                <td>

                    <button
                        type="button"
                        class="secondary delete-tenant-btn"
                        data-id="${tenant.id}">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    }
);

    // ===================================
    // Delete Buttons
    // ===================================

    document
        .querySelectorAll(
            ".delete-tenant-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteTenant(
                            button.dataset.id
                        );

                    }
                );

            }
        );

}


// ===========================================
// Tenant Statistics
// ===========================================

function updateTenantStatistics(
    tenants
) {

    const count =
        tenants.length;


    const revenue =
        tenants.reduce(
            (
                total,
                tenant
            ) => {

                return total +
                    Number(
                        tenant.monthlyRent || 0
                    );

            },
            0
        );


    if (tenantCount) {

        tenantCount.textContent =
            count;

    }


    if (tenantCountBadge) {

        tenantCountBadge.textContent =
            `${count} Tenant${count === 1 ? "" : "s"}`;

    }


    if (tenantRevenue) {

        tenantRevenue.textContent =
            `KES ${revenue.toLocaleString()}`;

    }


    if (occupiedUnits) {

        occupiedUnits.textContent =
            count;

    }

}


// ===========================================
// Register Tenant
// ===========================================

if (registerTenantBtn) {

    registerTenantBtn.addEventListener(
        "click",
        registerTenant
    );

}


async function registerTenant() {

    console.log("-------------------------------------------");
    console.log("REGISTER TENANT");
    console.log("-------------------------------------------");


    const landlordId =
        getLandlordId();


    const userId =
        localStorage.getItem(
            STORAGE.USER_ID
        );


    if (!landlordId) {

        alert(
            "No landlord account is currently active."
        );

        return;

    }


    // ===================================
    // Validate
    // ===================================

    if (
        !tenantName.value.trim() ||
        !tenantPhone.value.trim() ||
        !tenantProperty.value ||
        !tenantUnit.value ||
        !tenantRent.value
    ) {

        alert(
            "Please complete all required fields."
        );

        return;

    }


    const monthlyRent =
        Number(
            tenantRent.value
        );


    if (
        !Number.isFinite(monthlyRent) ||
        monthlyRent <= 0
    ) {

        alert(
            "Please enter a valid monthly rent."
        );

        return;

    }


    const data = {

        landlordId,

        userId,

        propertyId:
            tenantProperty.value,

        unitId:
            tenantUnit.value,

        fullName:
            tenantName.value.trim(),

        nationalId:
            tenantId.value.trim() ||
            null,

        phone:
            tenantPhone.value.trim(),

        email:
            tenantEmail.value.trim() ||
            null,

        monthlyRent

    };


    console.log(
        "Tenant Request:",
        data
    );


    try {

        registerTenantBtn.disabled =
            true;


        registerTenantBtn.textContent =
            "Registering...";


        const response =
            await fetch(
                "/api/tenants",
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


        const result =
            await response.json();


        console.log(
            "Tenant Registration Result:",
            result
        );


        if (!response.ok || !result.success) {

            alert(
                result.message ||
                "Unable to register tenant."
            );

            return;

        }


        alert(
            "Tenant registered successfully."
        );


        // ===================================
        // Clear Form
        // ===================================

        tenantName.value = "";

        tenantId.value = "";

        tenantPhone.value = "";

        tenantEmail.value = "";

        tenantProperty.selectedIndex =
            0;

        tenantUnit.innerHTML =
            `<option value="">
                Select Unit
            </option>`;

        tenantRent.value = "";


        // ===================================
        // Refresh Tenant List
        // ===================================

        await loadTenants();


        // ===================================
        // Refresh Properties/Units
        // ===================================

        await loadProperties();

    }

    catch (error) {

        console.error(
            "Register Tenant Error:",
            error
        );

        alert(
            "Unable to register tenant."
        );

    }

    finally {

        registerTenantBtn.disabled =
            false;

        registerTenantBtn.textContent =
            "Register Tenant";

    }

}


// ===========================================
// Delete Tenant
// ===========================================

async function deleteTenant(
    tenantId
) {

    if (!tenantId) {

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this tenant?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/tenants/${tenantId}`,
                {

                    method: "DELETE"

                }
            );


        const result =
            await response.json();


        console.log(
            "Delete Tenant Result:",
            result
        );


        if (!response.ok || !result.success) {

            alert(
                result.message ||
                "Unable to delete tenant."
            );

            return;

        }


        alert(
            "Tenant deleted successfully."
        );


        await loadTenants();

        await loadProperties();

    }

    catch (error) {

        console.error(
            "Delete Tenant Error:",
            error
        );

        alert(
            "Unable to delete tenant."
        );

    }

}


// ===========================================
// HTML Safety
// ===========================================

function escapeHtml(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ===========================================
// Initialize
// ===========================================

async function initializeTenantPage() {

    console.log("-------------------------------------------");
    console.log("TENANT PAGE INITIALIZED");
    console.log("-------------------------------------------");


    if (
        typeof STORAGE === "undefined"
    ) {

        console.error(
            "STORAGE is not available."
        );

        return;

    }


    await loadProperties();

    await loadTenants();


    console.log(
        "✅ Tenant Page Initialized"
    );

}


document.addEventListener(
    "DOMContentLoaded",
    initializeTenantPage
);


console.log(
    "✅ Tenant Module Version 11.7 Enterprise Loaded"
);