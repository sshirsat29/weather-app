// program for REST server in Go

package main

import(
	"encoding/json"
	"log"
	"net/http"
	
	"github.com/gorilla/mux"
)

type HelloCanada struct{
    City string `json:"city"`
    Province string `json:"province"`
}

var hello []HelloCanada

func GetCity (w http.ResponseWriter, req *http.Request){
    params := mux.Vars(req)
    for _,item := range hello{
        if item.City == params["city"]{
            json.NewEncoder(w).Encode(item)
            return
        }
    }
    json.NewEncoder(w).Encode(&HelloCanada{})
}

func GetHello (w http.ResponseWriter, req *http.Request){
    json.NewEncoder(w).Encode(hello)
}

func PostCity(w http.ResponseWriter, req *http.Request){
    params := mux.Vars(req)
    var city HelloCanada
    _ = json.NewDecoder(req.Body).Decode(&city)
    city.City = params["city"]
    hello = append(hello, city)
    json.NewEncoder(w).Encode(hello)
}

func DeleteCity(w http.ResponseWriter, req *http.Request){
    params := mux.Vars(req)
    for index, item := range hello{
        if item.City == params["city"]{
            hello = append(hello[:index], hello[index+1:]...)
            break
        }
    }
}

func main(){
    router := mux.NewRouter()

    hello = append(hello, HelloCanada{City:"Toronto",Province:"Ontario"})
    hello = append(hello, HelloCanada{City:"Vancouver",Province:"British Columbia"})

    router.HandleFunc("/", GetHello).Methods("GET")
	router.HandleFunc("/hello", GetHello).Methods("GET")
    router.HandleFunc("/hello/{city}",GetCity).Methods("GET")

    router.HandleFunc("/hello/{city}",PostCity).Methods("POST")

    router.HandleFunc("/hello/{city}",DeleteCity).Methods("DELETE")

    router.HandleFunc("/",func(w http.ResponseWriter, r *http.Request){
        http.ServeFile(w, r, r.URL.Path[:1])
    })

    log.Fatal(http.ListenAndServe(":3333",router))

}