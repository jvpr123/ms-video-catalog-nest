import { EntityValidationError } from "../../../shared/domain/validators/validation.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe("Category Unit Tests", () => {
  let validateSpy: any;

  beforeEach(() => validateSpy = jest.spyOn(Category, 'validate'));

  test("should create a category with default values via constructor successfully", () => {
      const category = new Category({
        name: "Movie",
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("should create a category with all values via constructor successfully", () => {
      const created_at = new Date();
      const category = new Category({
        name: "Movie",
        description: "Movie description",
        is_active: false,
        created_at,
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBe(created_at);
    });

    test("should create a category with name and description via constructor successfully", () => {
      const category = new Category({
        name: "Movie",
        description: "Movie description",
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("should create a category via create command successfully", () => {
      const category = Category.create({
        name: "Movie",
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test("should create a category with description via create command successfully", () => {
      const category = Category.create({
        name: "Movie",
        description: "some description",
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("some description");
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test("should create a category with is_active via create command successfully", () => {
      const category = Category.create({
        name: "Movie",
        is_active: false,
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(false);
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('should throw exception when invalid name is provided to create command', () => {
      expect(() => Category.create({ name: null })).containsErrorMessage({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ]});
    });

    test('should throw exception when invalid description is provided to create command', () => {
      expect(() => Category.create({ name: 'name', description: 't'.repeat(256) })).containsErrorMessage({
        description: ["description must be shorter than or equal to 255 characters"]});
    });

    test('should throw exception when invalid is_active is provided to create command', () => {
      expect(() => Category.create({ name: 'name', is_active: '' })).containsErrorMessage({
        is_active: [
          "is_active should not be empty",
          "is_active must be a boolean value",
        ]
      });
    });

  test("should change name successfully", () => {
    const category = new Category({ name: "Movie" });
    
    category.changeName("other name");
    expect(category.name).toBe("other name");
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("should change description", () => {
    const category = new Category({
      name: "Movie",
      description: "first description",
    });

    category.changeDescription("some description");
    expect(category.description).toBe("some description");
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("should active a category", () => {
    const category = Category.create({
      name: "Filmes",
      is_active: false,
    });
    category.activate();
    expect(category.is_active).toBe(true);
  });

  test("should disable a category", () => {
    const category = Category.create({
      name: "Filmes",
      is_active: true,
    });
    category.deactivate();
    expect(category.is_active).toBe(false);
  });
});