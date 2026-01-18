<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Handle Preflight Request for CORS
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// GET: Fetch all transactions
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM transactions ORDER BY date ASC");
        $data = $stmt->fetchAll();
        
        // Ensure numeric types are returned correctly for calculations
        $formattedData = array_map(function($row) {
            $row['amountUSD'] = (float)$row['amountUSD'];
            $row['rate'] = (float)$row['rate'];
            $row['totalBDT'] = (float)$row['totalBDT'];
            $row['extraCharges'] = (float)$row['extraCharges'];
            return $row;
        }, $data);

        echo json_encode($formattedData);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// POST: Add new transaction
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['id']) || !isset($data['type'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Incomplete data']);
        exit;
    }

    try {
        // Convert ISO date from JS to MySQL datetime format
        $date = date('Y-m-d H:i:s', strtotime($data['date']));

        $sql = "INSERT INTO transactions (id, type, amountUSD, rate, totalBDT, extraCharges, date) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt= $pdo->prepare($sql);
        $stmt->execute([
            $data['id'], 
            $data['type'], 
            $data['amountUSD'], 
            $data['rate'], 
            $data['totalBDT'], 
            $data['extraCharges'] ?? 0, 
            $date
        ]);
        http_response_code(201);
        echo json_encode(['message' => 'Transaction created']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// DELETE: Delete transaction
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['message' => 'ID required']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM transactions WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Transaction deleted']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>