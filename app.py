from flask import Flask, jsonify, send_from_directory
import geopandas as gpd

app = Flask(__name__)

# Load the shapefile
shapefile_path = "./assets/boundaries/PCON_DEC_2019_UK_BFC.shp"

gdf = gpd.read_file(shapefile_path)
gdf = gdf.to_crs(epsg=4326)

@app.route('/info')
def get_info():

    row = gdf.sample(n=1)
    random_point = row.geometry.sample_points(size=1).tolist()[0]
    random_coordinates = {'lat': random_point.y, 'lng': random_point.x}

    winner = row["winner"].tolist()[0]
    party_dict = {"Con":"Conservative", "Lab":"Labour", "SNP":"SNP", "LD":"Liberal Democrats", "DUP":"DUP", 
                  "SF":"Sinn Fein", "PC":"Plaid Cymru", "SDLP":"SDLP", "Green":"Green", "Spk":"Other", "Alliance":"Alliance"}
    winner = party_dict[winner]

    name = row["PCON19NM"].tolist()[0]

    return {"coords":random_coordinates, "winner":winner, "const_name":name}



@app.route('/')
def index():
    return send_from_directory('static', 'index.html')


if __name__ == '__main__':
    app.run(debug=True)
