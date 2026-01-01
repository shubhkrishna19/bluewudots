import pandas as pd
import json
import os

files = [
    'legacy/SKU Aliases, Parent & Child Master Data (1).xlsx',
    'legacy/Preferred Courier Calculator.xlsx',
    'legacy/Dimensions Master.xlsx',
    'legacy/Order Tracking Sheet OTS - Master 24-25.xlsx'
]

results = {}

class GenericEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, 'isoformat'):
            return obj.isoformat()
        if hasattr(obj, 'tolist'):
            return obj.tolist()
        return str(obj)

for file_path in files:
    full_path = os.path.join(os.getcwd(), file_path)
    if os.path.exists(full_path):
        try:
            # Load first sheet
            df = pd.read_excel(full_path, nrows=3)
            results[file_path] = {
                "columns": df.columns.tolist(),
                "sample": df.fillna("").to_dict(orient='records')
            }
        except Exception as e:
            results[file_path] = {"error": str(e)}
    else:
        results[file_path] = {"error": "File not found"}

with open('excel_metadata.json', 'w') as f:
    json.dump(results, f, indent=2, cls=GenericEncoder)

print("Metadata saved to excel_metadata.json")


