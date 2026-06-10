let students =
    JSON.parse(localStorage.getItem("students")) || [];

let editIndex = null;

const studentForm =
    document.getElementById("studentForm");

const studentContainer =
    document.getElementById("studentContainer");

const searchInput =
    document.getElementById("searchInput");

const courseFilter =
    document.getElementById("courseFilter");

const totalStudents =
    document.getElementById("totalStudents");

const avgProgress =
    document.getElementById("avgProgress");

const completedStudents =
    document.getElementById("completedStudents");

const editModal =
    document.getElementById("editModal");

const closeBtn =
    document.querySelector(".close");

const updateBtn =
    document.getElementById("updateBtn");


function saveData() {
    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}


function getStatus(progress) {

    progress = Number(progress);

    if (progress < 40) {
        return {
            text: "Poor",
            color: "#ef4444"
        };
    } else if (progress < 60) {
        return {
            text: "Average",
            color: "#f97316"
        };
    } else if (progress < 75) {
        return {
            text: "Good",
            color: "#eab308"
        };
    } else if (progress < 90) {
        return {
            text: "Very Good",
            color: "#22c55e"
        };
    } else {
        return {
            text: "Excellent",
            color: "#15803d"
        };
    }
}

function updateDashboard() {

    totalStudents.textContent =
        students.length;

    if (students.length === 0) {

        avgProgress.textContent =
            "0%";

        completedStudents.textContent =
            "0";

        return;
    }

    let total = 0;
    let completed = 0;

    students.forEach(student => {

        total +=
            Number(student.progress);

        if (
            Number(student.progress) >= 70
        ) {
            completed++;
        }

    });

    avgProgress.textContent =
        Math.round(
            total / students.length
        ) + "%";

    completedStudents.textContent =
        completed;
}

/* ---------------------------
   COURSE FILTER
---------------------------- */

function updateCourseFilter() {

    let courses = [...new Set(
        students.map(
            student => student.course
        )
    )];

    courseFilter.innerHTML =
        `<option value="all">
        All Courses
    </option>`;

    courses.forEach(course => {

        courseFilter.innerHTML +=
            `<option value="${course}">
            ${course}
        </option>`;

    });
}

function renderStudents(
    data = students
) {

    studentContainer.innerHTML = "";

    if (data.length === 0) {

        studentContainer.innerHTML =
            `<h3 style="text-align:center;">
            No Students Found
        </h3>`;

        return;
    }

    data.forEach((student, index) => {

        let status =
            getStatus(student.progress);

        studentContainer.innerHTML +=

            `
        <div class="student-card">

            <h3>
                👨‍🎓 ${student.name}
            </h3>

            <p>
                <strong>Age:</strong>
                ${student.age}
            </p>

            <p>
                <strong>Course:</strong>
                ${student.course}
            </p>

            <p>
                <strong>Progress:</strong>
                ${student.progress}%
            </p>

            <div class="progress-bar">

                <div class="progress"

                    style="
                    width:${student.progress}%;
                    background:${status.color};
                    ">

                </div>

            </div>

            <p style="
                margin-top:10px;
                color:${status.color};
                font-weight:bold;
            ">
                ${status.text}
            </p>

            <div class="actions">

                <button
                    class="edit-btn"
                    onclick="editStudent(${index})">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${index})">

                    Delete

                </button>

            </div>

        </div>
        `;
    });

    updateDashboard();
    updateCourseFilter();
}

studentForm.addEventListener(
    "submit",
    function(e) {

        e.preventDefault();

        let name =
            document.getElementById("name")
            .value;

        let age =
            document.getElementById("age")
            .value;

        let course =
            document.getElementById("course")
            .value;

        let progress =
            document.getElementById("progress")
            .value;

        students.push({
            name,
            age,
            course,
            progress
        });

        saveData();

        renderStudents();

        studentForm.reset();
    });

function deleteStudent(index) {

    if (
        confirm(
            "Delete this student?"
        )
    ) {

        students.splice(index, 1);

        saveData();

        renderStudents();
    }
}

function editStudent(index) {

    editIndex = index;

    let student =
        students[index];

    document.getElementById(
            "editName"
        ).value =
        student.name;

    document.getElementById(
            "editAge"
        ).value =
        student.age;

    document.getElementById(
            "editCourse"
        ).value =
        student.course;

    document.getElementById(
            "editProgress"
        ).value =
        student.progress;

    editModal.style.display =
        "block";
}

updateBtn.addEventListener(
    "click",
    function() {

        students[editIndex] = {

            name: document.getElementById(
                "editName"
            ).value,

            age: document.getElementById(
                "editAge"
            ).value,

            course: document.getElementById(
                "editCourse"
            ).value,

            progress: document.getElementById(
                "editProgress"
            ).value
        };

        saveData();

        renderStudents();

        editModal.style.display =
            "none";
    });

closeBtn.onclick =
    function() {

        editModal.style.display =
            "none";
    };

window.onclick =
    function(event) {

        if (
            event.target === editModal
        ) {

            editModal.style.display =
                "none";
        }
    };

searchInput.addEventListener(
    "keyup",
    function() {

        let value =
            searchInput.value
            .toLowerCase();

        let filtered =
            students.filter(student =>
                student.name
                .toLowerCase()
                .includes(value)
            );

        renderStudents(filtered);
    });

courseFilter.addEventListener(
    "change",
    function() {

        let value =
            courseFilter.value;

        if (
            value === "all"
        ) {

            renderStudents();
            return;
        }

        let filtered =
            students.filter(student =>
                student.course === value
            );

        renderStudents(filtered);
    });


document
    .getElementById(
        "themeToggle"
    )
    .addEventListener(
        "click",
        function() {

            document.body
                .classList.toggle(
                    "dark"
                );
        });


document
    .getElementById(
        "exportBtn"
    )
    .addEventListener(
        "click",
        function() {

            let csv =
                "Name,Age,Course,Progress\n";

            students.forEach(
                student => {

                    csv +=
                        `${student.name},
${student.age},
${student.course},
${student.progress}\n`;

                });

            let blob =
                new Blob(
                    [csv], {
                        type: "text/csv"
                    }
                );

            let url =
                URL.createObjectURL(blob);

            let a =
                document.createElement("a");
            a.href = url;

            a.download =
                "students.csv";

            a.click();
        });
renderStudents();