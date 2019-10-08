const Helpers = use('Helpers');
class FileController {
  show({ params, response }) {
    return response.download(Helpers.tmpPath(`uploads/${params.file}`));
  }
}

module.exports = FileController;
