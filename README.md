# Strike-a-Pose
applicazione che consente di replicare la posa di opere d’arte. 

L'applicazione web “Strike a Pose” ti permette di:
- Replicare le pose di opere d’arte
- scegliere tra varie modalità di gioco con tre livelli di difficoltà
- scaricare il video finale della partita e leggere informazioni relative alle opere replicate

## installazione ed esecuzione
1. aprire terminale nella cartella repository
2. entrare in blank-docker-project ``` cd blank-docker-project/ ```
3. eseguire ```docker compose build ``` 
4. eseguire ``` docker compose up ```

## Aggiunta di opere:
 Le informazioni sulle opere (percorso,descrizione,livello di gioco) e sui livelli sono inizializzate nel file ```web/frontend/fixtures/default_data.json```. 
 
 Per aggiungere elementi al database è sufficiente inserire il nuovo elemento nel file json e riavviare il container docker.
 
 Esso eseguirà i  comandi 
 1. ```python manage.py loaddata default_data.json``` che carica i dati presenti nel file Json all'interno del database.
 2. ```python manage.py makemigrations``` e  ```python manage.py migrate```, che permettono quando vengono modificati elementi del database di aggiornare anche il file ```models.py``` dell'applicativo python
 
 specificati in ```docker-compose.yaml```.

In alternativa si possono eseguire i comandi precedenti in maniera manuale senza la necessità di riavviare l'applicativo