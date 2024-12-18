const { mockModel } = require('./db.mock');
const { list, get, edit, destroy, create } = require('../products');

jest.mock('../db', () => ({ 
  model: jest.fn().mockReturnValue(mockModel),
}));

describe('Product Module', () => {
// your tests go here
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('list', () => {
    it('should list all products', async () => {
      const products = await list();
      expect(products.length).toBeGreaterThan(0);
      expect(products[0].description).toBe('Product 1');
      expect(products[1].description).toBe('Product 2');
    });
  });

  describe('get', () => {
    it('should get a product by id', async () => {
      mockModel.findById = jest.fn().mockResolvedValue({
        description: 'Product 1' 
      });

      const product = await get('product-id');
      expect(product.description).toBe('Product 1')
      expect(mockModel.findById).toHaveBeenCalledWith('product-id'); 
    });
  });
  describe('destroy', () => {
    it('should delete a product ', async () =>{
      mockModel.deleteOne = jest.fn().mockResolvedValue({deletedCount: 1});
      const result = await destroy('product-id');
      expect(result.deletedCount).toBe(1);
      expect(mockModel.deleteOne).toHaveBeenCalledWith({_id: 'product-id'
      });
    });
    it('should handle product not found', async () => {
      mockModel.deleteOne = jest.fn().mockResolvedValue({deletedCount: 0});
      const result = await destroy('non-existent-id');
      expect(result.deletedCount).toBe(0);
      expect(mockModel.deleteOne).toHaveBeenCalledWith({_id: 'non-existent-id'
      });
    });
  });
});