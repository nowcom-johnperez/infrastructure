# nowcom-rancher-plugins
Example Extensions for the Rancher Dashboard UI.


The extensions should then appear on the 'Extenssions' page in Rancher Manager.

## Building and running locally
You can build and run the extensions locally, to do so:

- Run `yarn install`
- Set the API environment variable to point to a Rancher backend `API=IPHERE yarn dev`
- Run Rancher in development mode with `yarn dev`
- Open a web browser to `https://127.0.0.1:8005`

Once you login, you should see Rancher load with the extensions automatically loaded. You can edit the code for the extensions
and then should hot-reload within the browser.


