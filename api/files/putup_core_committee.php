<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../../config/DbConnection.php';
require_once '../../models/Files.php';
require_once '../../utils/send.php';
require_once '../../utils/loggedin.php';

class Putup_core_committee_api extends Files
{
    private $Putup_core_committee;

    // Initialize connection with DB
    public function __construct()
    {
        // Connect with DB
        $dbconnection = new DbConnection();
        $db = $dbconnection->connect();

        // Create an object for putup core committee table to do operations
        $this->Putup_core_committee = new Files($db);

        // Set table name
        $this->Putup_core_committee->table = 'purchase_putup_core_committee';

        // Set column names
        $this->Putup_core_committee->id_name = 'putup_core_committee_id';
        $this->Putup_core_committee->col_name = 'putup_core_committee_name';
        $this->Putup_core_committee->col_type = 'putup_core_committee_type';
        $this->Putup_core_committee->col = 'putup_core_committee';
        $this->Putup_core_committee->col_date = 'putup_core_committee_date';
    }

    // Get all data
    public function get()
    {
        // Get the info from DB
        $all_data = $this->Putup_core_committee->read();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['putup_core_committee'] = base64_encode($row['putup_core_committee']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about putup core committee found');
            die();
        }
    }

    // Get all the data of putup core committee
    public function get_by_id($id)
    {
        // Get the info from DB
        $this->Putup_core_committee->purchase_id = $id;
        $all_data = $this->Putup_core_committee->read_row();

        if ($all_data) {
            $data = array();
            while ($row = $all_data->fetch(PDO::FETCH_ASSOC)) {
                $row['putup_core_committee'] = base64_encode($row['putup_core_committee']);
                array_push($data, $row);
            }
            echo json_encode($data);
            die();
        } else {
            send(400, 'error', 'no info about putup core committee found');
            die();
        }
    }

    // POST a new file
    public function post()
    {
        if ($_FILES['putup_core_committee']['size'] >= 1572864) {
            send(400, "error", "file size must be less than 1.5MB");
            die();
        }

        if (!isset($_GET['ID'])) {
            send(400, 'error', 'provide a purchase ID');
            die();
        }

        // Clean the data
        $this->Putup_core_committee->purchase_id = $_GET['ID'];
        $this->Putup_core_committee->col_name_value = $_FILES['putup_core_committee']['name'];
        $this->Putup_core_committee->col_type_value = $_FILES['putup_core_committee']['type'];
        $this->Putup_core_committee->col_value = file_get_contents($_FILES['putup_core_committee']['tmp_name']);
        $this->Putup_core_committee->col_date_value=$_POST['putup_core_committee_date'];

        if ($this->Putup_core_committee->post()) {
            $this->get_by_id($_GET['ID']);
        } else {
            send(400, 'error', 'putup core committee file cannot be uploaded');
        }
    }

    // Delete a file
    public function delete_by_id()
    {
        if (!isset($_GET['ID'])) {
            send(400, "error", "provide an ID");
            die();
        }

        $this->Putup_core_committee->id = $_GET['ID'];
        if ($this->Putup_core_committee->delete_row()) {
            send(200, 'message', 'putup core committee file successfully');
        } else {
            send(400, 'error', 'putup core committee file cannot deleted');
        }
    }
}



// GET all the info
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $Putup_core_committee_api = new Putup_core_committee_api();
    if (isset($_GET['ID'])) {
        $Putup_core_committee_api->get_by_id($_GET['ID']);
    }else {
        $Putup_core_committee_api->get();
    }
}

// To check if admin is logged in
loggedin();

// If admin logged in ...

// POST a new file
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $Putup_core_committee_api = new Putup_core_committee_api();
    $Putup_core_committee_api->post();
}

// DELETE a file
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $Putup_core_committee_api = new Putup_core_committee_api();
    $Putup_core_committee_api->delete_by_id();
}
