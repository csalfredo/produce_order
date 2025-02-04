<!DOCTYPE html>
<html>
<head>
    <title>Produce Order</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        h1 {
            color: #2c5282;
            text-align: center;
            padding-bottom: 10px;
            border-bottom: 2px solid #4299e1;
        }

        h2 {
            color: #2d3748;
            margin-top: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: #fff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        th {
            background-color: #4299e1;
            color: white;
            padding: 12px;
            text-align: left;
        }

        td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
        }

        tr:nth-child(even) {
            background-color: #f7fafc;
        }

        h3 {
            color: #2c5282;
            text-align: right;
            margin-top: 20px;
            font-size: 1.2em;
        }

        .total {
            font-weight: bold;
            font-size: 1.1em;
            color: #2c5282;
        }
    </style>
</head>
<body>
    <h1>New Produce Order</h1>
    
    <h2>Order Details:</h2>
    <table>
        <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
        </tr>
        @foreach($order['items'] as $item)
        <tr>
            <td>{{ $item['name'] }}</td>
            <td>{{ $item['quantity'] }}</td>
            <td>${{ number_format($item['case_cost'], 2) }}</td>
        </tr>
        @endforeach
    </table>

    <h3>Total: <span class="total">${{ number_format($total, 2) }}</span></h3>
</body>
</html>