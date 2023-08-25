from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)
# MongoDB connection setup
client = MongoClient("mongodb://localhost:27017/")
db = client['insurance_db']
# old_collection = db['insurance_collection']
new_collection = db['insurance_collection2']
collection = db['insurance_collection2']  # Replace with your actual collection name


# Code to change the structure of the existing file into much more developer friendly
# for old_doc in old_collection.find():
#     new_doc = {
#         "_id": old_doc["_id"],
#         "age_range": old_doc["age_range"],
#         "member_csv": old_doc["member_csv"],
#         "tier": old_doc["tier"],
#         "premium_values": [
#             {"sum_insured": int(key), "value": value}
#             for key, value in old_doc.items() if key.isdigit()
#         ]
#     }
#     new_collection.insert_one(new_doc)


@app.route('/get_premium', methods=['GET'])
def get_premium():
    data = []
    member_csv = request.args.get('member_csv')
    query = {} 
    if member_csv:
        query['member_csv'] = member_csv


    all_document = collection.find(query)

    for document in all_document:
        document['_id'] = str(document['_id'])
        data.append(document)
    jsonified_data = jsonify(data)
    return jsonified_data


if __name__ == '__main__':
    app.run()
